import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatPyg, formatDateTime, statusLabel, statusColor } from '@/lib/format';

export const metadata = { title: 'Mi cuenta · celutecnicos' };

export default async function MiCuentaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const { data: regs } = await supabase
    .from('registrations')
    .select('*, event_categories(name, kind), events(title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-cgc-orange">Mi cuenta</div>
            <h1 className="mt-2 font-display text-4xl text-zinc-100 sm:text-5xl">
              Hola, {profile?.full_name?.split(' ')[0] ?? 'técnico'}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">{user.email}</p>
          </div>
          <Link href="/inscripcion" className="btn-primary text-sm">
            + Nueva inscripción
          </Link>
        </div>

        <h2 className="mb-4 font-display text-2xl text-zinc-100">Mis inscripciones</h2>

        {!regs || regs.length === 0 ? (
          <div className="card text-center">
            <p className="text-zinc-400">Todavía no te inscribiste a ninguna categoría.</p>
            <Link href="/inscripcion" className="btn-primary mt-4 text-sm">
              Inscribirme ahora
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {regs.map((r: any) => (
              <Link
                key={r.id}
                href={`/pago/${r.id}`}
                className="block rounded-xl border border-zinc-800 bg-cgc-carbon p-5 transition hover:border-zinc-700"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-2xl text-zinc-100">
                      {r.event_categories?.name}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {r.events?.title} · {formatDateTime(r.created_at)}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor(r.status)}`}
                      >
                        {statusLabel(r.status)}
                      </span>
                      <span className="rounded-full border border-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
                        {r.reference_code}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl text-cgc-orange">
                      {formatPyg(r.amount)}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">Ver detalle →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
