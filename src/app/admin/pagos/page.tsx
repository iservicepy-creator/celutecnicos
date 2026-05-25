import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPyg, formatDateTime } from '@/lib/format';
import { AccionesPago } from './AccionesPago';

export const metadata = { title: 'Admin · Pagos' };

export default async function AdminPagosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) redirect('/');

  const { data: payments } = await supabase
    .from('payments')
    .select('*, registrations(reference_code, status, event_categories(name)), profiles:user_id(full_name, email, phone)')
    .order('created_at', { ascending: false })
    .limit(100);

  const pending = (payments ?? []).filter((p) => p.status === 'pending');
  const verified = (payments ?? []).filter((p) => p.status === 'verified');

  return (
    <div className="container-x py-12">
      <Link href="/admin" className="text-sm text-zinc-400 hover:text-zinc-100">
        ← Admin
      </Link>
      <h1 className="mt-3 font-display text-4xl text-zinc-100">Verificar pagos</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Mirá el comprobante y confirmá o rechazá. La inscripción se actualiza automáticamente.
      </p>

      <h2 className="mb-3 mt-10 font-display text-2xl text-cgc-orange">
        Pendientes ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <div className="card text-center text-sm text-zinc-400">
          🎉 No hay pagos pendientes por verificar.
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((p: any) => (
            <PaymentCard key={p.id} payment={p} />
          ))}
        </div>
      )}

      <h2 className="mb-3 mt-10 font-display text-2xl text-zinc-400">
        Verificados ({verified.length})
      </h2>
      {verified.length > 0 && (
        <div className="space-y-3">
          {verified.slice(0, 20).map((p: any) => (
            <PaymentCard key={p.id} payment={p} compact />
          ))}
        </div>
      )}
    </div>
  );
}

async function PaymentCard({ payment, compact }: { payment: any; compact?: boolean }) {
  const supabase = await createClient();

  // Generar URL firmada del comprobante (privado)
  let receiptUrl: string | null = null;
  if (payment.receipt_url) {
    const { data } = await supabase.storage
      .from('receipts')
      .createSignedUrl(payment.receipt_url, 60 * 60); // 1 hora
    receiptUrl = data?.signedUrl ?? null;
  }

  return (
    <div className={`card ${compact ? 'opacity-70' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-2xl text-zinc-100">
              {formatPyg(payment.amount)}
            </span>
            <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
              {payment.registrations?.reference_code}
            </span>
            {payment.status === 'verified' && (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                ✓ Verificado
              </span>
            )}
          </div>
          <div className="mt-3 grid gap-1 text-sm">
            <div>
              <span className="text-zinc-500">Técnico:</span>{' '}
              <span className="text-zinc-100">{payment.profiles?.full_name ?? '—'}</span>
            </div>
            <div>
              <span className="text-zinc-500">Email:</span>{' '}
              <span className="text-zinc-300">{payment.profiles?.email ?? '—'}</span>
            </div>
            <div>
              <span className="text-zinc-500">Teléfono:</span>{' '}
              <span className="text-zinc-300">{payment.profiles?.phone ?? '—'}</span>
            </div>
            <div>
              <span className="text-zinc-500">Categoría:</span>{' '}
              <span className="text-zinc-300">
                {payment.registrations?.event_categories?.name ?? '—'}
              </span>
            </div>
            {payment.bank_transaction_ref && (
              <div>
                <span className="text-zinc-500">N° operación:</span>{' '}
                <span className="font-mono text-zinc-100">{payment.bank_transaction_ref}</span>
              </div>
            )}
            <div className="text-xs text-zinc-500">
              Subido {formatDateTime(payment.created_at)}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {receiptUrl && (
            <a
              href={receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
            >
              📎 Ver comprobante
            </a>
          )}
          {payment.status === 'pending' && (
            <AccionesPago paymentId={payment.id} registrationId={payment.registration_id} />
          )}
        </div>
      </div>
    </div>
  );
}
