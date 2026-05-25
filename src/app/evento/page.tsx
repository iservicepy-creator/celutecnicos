import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPyg, formatUsd, formatDate } from '@/lib/format';
import type { Event } from '@/lib/types';

export const metadata = { title: 'El evento · CGC Triple Frontera 2026' };
export const revalidate = 60;

export default async function EventoPage() {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', 'cgc-paraguay-2026')
    .maybeSingle<Event>();

  const { data: categories } = await supabase
    .from('event_categories')
    .select('*')
    .eq('event_id', event?.id ?? '')
    .eq('active', true)
    .order('display_order');

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-widest text-cgc-orange">
            El evento
          </div>
          <h1 className="mt-2 font-display text-5xl text-zinc-100 sm:text-6xl">
            {event?.title}
          </h1>
          <p className="mt-2 text-lg text-zinc-300">{event?.subtitle}</p>
        </div>

        <p className="mb-12 max-w-2xl text-base leading-relaxed text-zinc-300">
          {event?.description}
        </p>

        {/* Datos clave */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="card">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Fecha</div>
            <div className="mt-2 font-display text-xl text-zinc-100">
              {event && formatDate(event.start_date)}
            </div>
            <div className="text-sm text-zinc-400">
              al {event && formatDate(event.end_date)}
            </div>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Sede</div>
            <div className="mt-2 font-display text-xl text-zinc-100">{event?.venue_name}</div>
            <div className="text-sm text-zinc-400">{event?.venue_address}</div>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Organizan</div>
            <div className="mt-2 text-sm font-semibold text-zinc-100">FIXCON × CGC World Cup</div>
            <div className="text-sm text-zinc-400">KikeCell × G-LON</div>
          </div>
        </div>

        {/* Agenda */}
        <div className="mb-12">
          <h2 className="mb-6 font-display text-3xl text-zinc-100">Agenda oficial</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card">
              <div className="text-xs uppercase tracking-widest text-cgc-orange">Día 1 · 04 Julio</div>
              <h3 className="mt-2 font-display text-2xl text-zinc-100">
                Apertura, Demos & Experiencia
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                <li>• Ceremonia oficial de apertura</li>
                <li>• Apertura de FIXCON Expo</li>
                <li>• Demos técnicas y actividades interactivas</li>
                <li>• Activaciones de marcas y showcases</li>
                <li>• Cena oficial de apertura VIP</li>
              </ul>
            </div>
            <div className="card">
              <div className="text-xs uppercase tracking-widest text-cgc-orange">Día 2 · 05 Julio</div>
              <h3 className="mt-2 font-display text-2xl text-zinc-100">
                Finales & Cierre Oficial
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                <li>• Finales oficiales de competencia</li>
                <li>• Ceremonia de premiación</li>
                <li>• Actividades de cierre</li>
                <li>• Cena de despedida VIP con brindis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Precios */}
        <div className="mb-12">
          <h2 className="mb-6 font-display text-3xl text-zinc-100">Precios</h2>
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-cgc-carbon text-left">
                <tr>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-zinc-400">Categoría</th>
                  <th className="px-5 py-3 text-right text-xs uppercase tracking-widest text-zinc-400">PYG</th>
                  <th className="px-5 py-3 text-right text-xs uppercase tracking-widest text-zinc-400">USD</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((c) => (
                  <tr key={c.id} className="border-t border-zinc-800 bg-cgc-carbon/30">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-zinc-100">{c.name}</div>
                      <div className="text-xs text-zinc-500">{c.description}</div>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-zinc-100">
                      {formatPyg(c.price_pyg)}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-zinc-400">
                      {formatUsd(c.price_usd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/inscripcion" className="btn-primary">
            Inscribirme ahora →
          </Link>
          <a
            href="https://joincgc.com/event/paraguay-2026"
            target="_blank"
            className="btn-secondary"
          >
            Ver en joincgc.com
          </a>
        </div>
      </div>
    </div>
  );
}
