import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPyg, formatDateTime, statusLabel, statusColor } from '@/lib/format';

export const metadata = { title: 'Admin · Inscripciones' };

export default async function AdminInscripcionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) redirect('/');

  const { data: regs } = await supabase
    .from('registrations')
    .select('*, event_categories(name, kind), profiles:user_id(full_name, email, phone, country)')
    .order('created_at', { ascending: false });

  return (
    <div className="container-x py-12">
      <Link href="/admin" className="text-sm text-zinc-400 hover:text-zinc-100">
        ← Admin
      </Link>
      <h1 className="mt-3 font-display text-4xl text-zinc-100">Inscripciones</h1>
      <p className="mt-2 text-sm text-zinc-400">Total: {regs?.length ?? 0}</p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-cgc-carbon">
            <tr className="text-left text-xs uppercase tracking-widest text-zinc-400">
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Técnico</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Monto</th>
              <th className="px-4 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {regs?.map((r: any) => (
              <tr key={r.id} className="border-t border-zinc-800 hover:bg-cgc-carbon/40">
                <td className="px-4 py-3 font-mono text-zinc-200">{r.reference_code}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-zinc-100">
                    {r.profiles?.full_name ?? '—'}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {r.profiles?.email}
                    {r.profiles?.country && ` · 🌎 ${r.profiles.country}`}
                  </div>
                  {r.profiles?.phone && (
                    <div className="text-xs text-zinc-500">📱 {r.profiles.phone}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-200">{r.event_categories?.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${statusColor(r.status)}`}
                  >
                    {statusLabel(r.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-zinc-100">
                  {formatPyg(r.amount)}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {formatDateTime(r.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!regs || regs.length === 0) && (
          <div className="p-8 text-center text-zinc-500">No hay inscripciones todavía.</div>
        )}
      </div>
    </div>
  );
}
