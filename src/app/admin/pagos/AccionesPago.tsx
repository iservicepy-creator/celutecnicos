'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AccionesPago({
  paymentId,
  registrationId
}: { paymentId: string; registrationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<'verify' | 'reject' | null>(null);

  async function verify() {
    if (!confirm('¿Confirmar que el pago llegó? La inscripción se marcará como confirmada.')) return;
    setLoading('verify');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from('payments')
      .update({ status: 'verified', verified_at: new Date().toISOString(), verified_by: user?.id })
      .eq('id', paymentId);
    await supabase
      .from('registrations')
      .update({ status: 'confirmed' })
      .eq('id', registrationId);
    setLoading(null);
    router.refresh();
  }

  async function reject() {
    const reason = prompt('Motivo del rechazo (ej: monto no coincide):');
    if (!reason) return;
    setLoading('reject');
    const supabase = createClient();
    await supabase
      .from('payments')
      .update({ status: 'rejected', rejected_reason: reason })
      .eq('id', paymentId);
    await supabase
      .from('registrations')
      .update({ status: 'pending_payment' })
      .eq('id', registrationId);
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={reject}
        disabled={!!loading}
        className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/20"
      >
        {loading === 'reject' ? '…' : '✗ Rechazar'}
      </button>
      <button
        onClick={verify}
        disabled={!!loading}
        className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-bold text-cgc-black hover:bg-emerald-400"
      >
        {loading === 'verify' ? '…' : '✓ Confirmar'}
      </button>
    </div>
  );
}
