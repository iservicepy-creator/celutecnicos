import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Admin · celutecnicos' };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) redirect('/');

  // Métricas
  const [{ count: totalRegs }, { count: pendingPays }, { count: confirmedRegs }] = await Promise.all([
    supabase.from('registrations').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'confirmed')
  ]);

  const { data: revenue } = await supabase
    .from('registrations')
    .select('amount')
    .eq('status', 'confirmed');

  const totalRevenue = (revenue ?? []).reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div className="container-x py-12">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-widest text-cgc-orange">Admin</div>
        <h1 className="mt-2 font-display text-4xl text-zinc-100">Panel de control</h1>
      </div>

      {/* Cards de métricas */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Inscripciones totales" value={totalRegs ?? 0} />
        <Stat label="Confirmadas" value={confirmedRegs ?? 0} accent />
        <Stat label="Pagos por verificar" value={pendingPays ?? 0} warning={!!pendingPays} />
        <Stat
          label="Ingresos confirmados"
          value={new Intl.NumberFormat('es-PY', {
            style: 'currency', currency: 'PYG', maximumFractionDigits: 0
          }).format(totalRevenue)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/pagos"
          className="card flex items-center justify-between transition hover:border-cgc-orange/60"
        >
          <div>
            <h2 className="font-display text-2xl text-zinc-100">Verificar pagos</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Revisá comprobantes y confirmá inscripciones.
            </p>
          </div>
          {!!pendingPays && (
            <span className="rounded-full bg-cgc-orange px-3 py-1 text-xs font-bold text-cgc-black">
              {pendingPays}
            </span>
          )}
        </Link>

        <Link
          href="/admin/inscripciones"
          className="card flex items-center justify-between transition hover:border-cgc-orange/60"
        >
          <div>
            <h2 className="font-display text-2xl text-zinc-100">Inscripciones</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Lista completa con filtros por estado.
            </p>
          </div>
          <span className="text-xs text-zinc-500">→</span>
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  warning
}: { label: string; value: number | string; accent?: boolean; warning?: boolean }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-widest text-zinc-500">{label}</div>
      <div
        className={`mt-2 font-display text-3xl ${
          accent ? 'text-emerald-300' : warning ? 'text-cgc-orange' : 'text-zinc-100'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
