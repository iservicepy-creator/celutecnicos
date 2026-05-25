import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPyg, statusLabel, statusColor } from '@/lib/format';
import { SubirComprobante } from './SubirComprobante';
import type { BankAccount } from '@/lib/types';

export const metadata = { title: 'Pago · celutecnicos' };

export default async function PagoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: reg } = await supabase
    .from('registrations')
    .select('*, event_categories(name, kind)')
    .eq('id', id)
    .maybeSingle();

  if (!reg || reg.user_id !== user.id) notFound();

  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['bank_accounts', 'whatsapp_number']);

  const map: Record<string, any> = {};
  settings?.forEach((s) => (map[s.key] = s.value));

  const accounts: BankAccount[] = Array.isArray(map['bank_accounts']) ? map['bank_accounts'] : [];
  const wa: string = (map['whatsapp_number'] ?? '+595').toString();
  const waDigits = wa.replace(/[^\d]/g, '');

  const waMsg = encodeURIComponent(
    `Hola! Soy ${user.email}.\nAdjunto comprobante de la inscripción al CGC Triple Frontera 2026.\nCódigo de referencia: ${reg.reference_code}\nMonto: ${formatPyg(reg.amount)}\nCategoría: ${(reg as any).event_categories?.name ?? ''}`
  );

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href="/mi-cuenta" className="text-sm text-zinc-400 hover:text-zinc-100">
            ← Volver a mi cuenta
          </Link>
          <h1 className="mt-4 font-display text-4xl text-zinc-100 sm:text-5xl">
            Pagá tu inscripción
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusColor(reg.status)}`}
            >
              {statusLabel(reg.status)}
            </span>
            <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-300">
              Categoría: {(reg as any).event_categories?.name}
            </span>
          </div>
        </div>

        {/* Resumen */}
        <div className="card mb-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-zinc-500">Código de referencia</div>
              <div className="mt-1 font-display text-2xl text-cgc-orange">{reg.reference_code}</div>
              <div className="mt-1 text-xs text-zinc-500">Mencionar este código en la transferencia</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-zinc-500">Monto a pagar</div>
              <div className="mt-1 font-display text-2xl text-zinc-100">{formatPyg(reg.amount)}</div>
              <div className="mt-1 text-xs text-zinc-500">Pago único, sin comisiones</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-zinc-500">Tu email</div>
              <div className="mt-1 text-sm text-zinc-100">{user.email}</div>
              <div className="mt-1 text-xs text-zinc-500">Te avisamos cuando se confirme</div>
            </div>
          </div>
        </div>

        {/* Instrucciones de pago */}
        {reg.status === 'pending_payment' && (
          <div className="card mb-6">
            <h2 className="font-display text-2xl text-zinc-100">1. Hacé la transferencia</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Elegí la opción que más te convenga. <strong className="text-cgc-orange">Importante:</strong> agregá tu código <strong className="text-zinc-100">{reg.reference_code}</strong> en el concepto/motivo de la transferencia.
            </p>

            <div className="mt-6 space-y-4">
              {accounts.map((a, i) => (
                <div key={i} className="rounded-lg border border-zinc-800 bg-cgc-black p-4">
                  <div className="mb-3 text-xs font-bold uppercase tracking-widest text-cgc-orange">
                    {a.method === 'eko' ? '💸 EKO (más fácil)' : `🏦 ${a.bank}`}
                  </div>
                  <div className="font-semibold text-zinc-100">{a.label}</div>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    {a.alias_phone && (
                      <Row label="Alias / Teléfono" value={a.alias_phone} copy />
                    )}
                    {a.account_number && (
                      <Row label="Número de cuenta" value={a.account_number} copy />
                    )}
                    <Row label="Titular" value={a.holder} />
                    {a.ci && <Row label="C.I." value={a.ci} />}
                  </dl>
                  {a.instructions && (
                    <p className="mt-3 text-xs text-zinc-500">{a.instructions}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enviar comprobante */}
        {reg.status === 'pending_payment' && (
          <div className="card">
            <h2 className="font-display text-2xl text-zinc-100">2. Enviá tu comprobante</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Una vez transferido, elegí cómo enviar el comprobante. Te confirmamos en máximo 24 hs.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a
                href={`https://wa.me/${waDigits}?text=${waMsg}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-5 transition hover:bg-emerald-500/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-cgc-black">
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 14.4l-2.6-1.2c-.4-.2-.8-.1-1.1.2l-.8.8c-1.3-.7-2.4-1.8-3.1-3.1l.8-.8c.3-.3.4-.7.2-1.1L9.6 6.5C9.4 6 8.9 5.8 8.5 6L6.7 6.7c-.4.2-.7.6-.7 1.1.1 4.7 3.9 8.5 8.6 8.6.5 0 .9-.3 1.1-.7l.7-1.8c.2-.5 0-1-.4-1.2-.5-.2-1-.4-1.5-.6z" />
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 1.7.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.2 14.7 4 13.4 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-emerald-200">Enviar por WhatsApp</div>
                  <div className="text-xs text-emerald-300/80">Más rápido · respuesta personal</div>
                </div>
                <svg className="h-5 w-5 text-emerald-300 transition group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>

              <SubirComprobante registrationId={reg.id} amount={reg.amount} />
            </div>
          </div>
        )}

        {reg.status === 'awaiting_verification' && (
          <div className="card border-blue-500/40 bg-blue-500/5">
            <h2 className="font-display text-2xl text-zinc-100">Comprobante recibido ✓</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Estamos verificando tu pago. Te vamos a confirmar por email y WhatsApp en máximo 24 hs hábiles.
            </p>
          </div>
        )}

        {reg.status === 'confirmed' && (
          <div className="card border-emerald-500/40 bg-emerald-500/5">
            <h2 className="font-display text-2xl text-zinc-100">¡Inscripción confirmada! 🎉</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Nos vemos el 4 y 5 de julio en el Hotel Gran Nobile. Te enviaremos info adicional por email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-zinc-500">{label}</dt>
      <dd className="mt-0.5 font-mono text-base text-zinc-100">
        {value}
        {copy && (
          <span className="ml-2 text-xs text-zinc-500 select-none">(copiá este dato)</span>
        )}
      </dd>
    </div>
  );
}
