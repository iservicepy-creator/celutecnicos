'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SubirComprobante({
  registrationId,
  amount
}: {
  registrationId: string;
  amount: number;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [bankRef, setBankRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Tu sesión expiró. Volvé a ingresar.');
      setLoading(false);
      return;
    }

    // Subir archivo al bucket receipts (privado)
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${registrationId}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('receipts')
      .upload(path, file, { upsert: true });

    if (upErr) {
      setError('No pudimos subir el archivo: ' + upErr.message);
      setLoading(false);
      return;
    }

    // Crear registro de payment
    const { error: payErr } = await supabase.from('payments').insert({
      registration_id: registrationId,
      user_id: user.id,
      amount,
      currency: 'PYG',
      method: 'transfer',
      bank_transaction_ref: bankRef || null,
      receipt_url: path
    });

    if (payErr) {
      setError('No pudimos registrar el pago: ' + payErr.message);
      setLoading(false);
      return;
    }

    // Cambiar estado de la inscripción
    await supabase
      .from('registrations')
      .update({ status: 'awaiting_verification' })
      .eq('id', registrationId);

    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-lg border border-zinc-700 bg-zinc-900/40 p-5"
    >
      <div>
        <div className="font-semibold text-zinc-100">Subir comprobante</div>
        <div className="text-xs text-zinc-400">JPG, PNG o PDF · máx 10 MB</div>
      </div>
      <input
        type="file"
        accept="image/*,application/pdf"
        required
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-cgc-orange file:px-3 file:py-2 file:text-sm file:font-semibold file:text-cgc-black hover:file:bg-cgc-orangeLight"
      />
      <input
        type="text"
        value={bankRef}
        onChange={(e) => setBankRef(e.target.value)}
        placeholder="N° de operación (opcional)"
        className="input text-sm"
      />
      {error && <div className="text-sm text-red-300">{error}</div>}
      <button type="submit" disabled={!file || loading} className="btn-primary text-sm">
        {loading ? 'Subiendo…' : 'Enviar comprobante'}
      </button>
    </form>
  );
}
