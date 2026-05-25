'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatPyg, formatUsd } from '@/lib/format';
import type { EventCategory } from '@/lib/types';

type ExistingReg = {
  id: string;
  category_id: string;
  status: string;
  reference_code: string;
};

export function InscripcionForm({
  eventId,
  categories,
  existing
}: {
  eventId: string;
  categories: EventCategory[];
  existing: ExistingReg[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const existingMap = new Map(existing.map((e) => [e.category_id, e]));

  async function onSubmit() {
    if (!selected) return;
    setError(null);
    setLoading(true);
    const supabase = createClient();

    const cat = categories.find((c) => c.id === selected);
    if (!cat) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const { data, error } = await supabase
      .from('registrations')
      .insert({
        user_id: user.id,
        event_id: eventId,
        category_id: selected,
        amount: cat.price_pyg ?? 0,
        currency: 'PYG'
      })
      .select('id')
      .single();

    if (error || !data) {
      setLoading(false);
      setError(error?.message ?? 'No pudimos crear la inscripción. Probá de nuevo.');
      return;
    }

    router.push(`/pago/${data.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {categories.map((c) => {
          const ex = existingMap.get(c.id);
          const isSelected = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => !ex && setSelected(c.id)}
              disabled={!!ex}
              className={[
                'w-full rounded-xl border p-5 text-left transition',
                isSelected
                  ? 'border-cgc-orange bg-cgc-orange/10'
                  : 'border-zinc-800 bg-cgc-carbon hover:border-zinc-700',
                ex ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              ].join(' ')}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-display text-2xl text-zinc-100">{c.name}</div>
                    {c.kind === 'competitor' && (
                      <span className="rounded-full bg-cgc-orange/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cgc-orangeLight">
                        Competidor
                      </span>
                    )}
                    {c.kind === 'vip' && (
                      <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-300">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{c.description}</p>
                  {ex && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                      Ya tenés una inscripción ({ex.reference_code}) — Estado: {ex.status}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl text-cgc-orange">
                    {formatPyg(c.price_pyg)}
                  </div>
                  <div className="text-xs text-zinc-500">{formatUsd(c.price_usd)}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!selected || loading}
        className="btn-primary w-full text-base"
      >
        {loading ? 'Procesando…' : selected ? 'Continuar al pago →' : 'Elegí una categoría'}
      </button>
    </div>
  );
}
