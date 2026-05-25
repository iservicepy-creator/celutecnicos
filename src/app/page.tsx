import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Countdown } from '@/components/Countdown';
import { formatPyg, formatUsd, daysUntil } from '@/lib/format';
import type { Event, EventCategory } from '@/lib/types';

export const revalidate = 60; // refresca cada 60s

export default async function HomePage() {
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

  const startIso = `${event?.start_date ?? '2026-07-04'}T08:00:00-03:00`;
  const days = daysUntil(startIso);

  const competitors = (categories ?? []).filter((c) => c.kind === 'competitor') as EventCategory[];
  const spectators = (categories ?? []).filter((c) => c.kind !== 'competitor') as EventCategory[];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-900">
        {/* banderas Triple Frontera */}
        <div aria-hidden className="absolute inset-0 flex opacity-[0.07]">
          <div className="flex-1 bg-flag-ar" />
          <div className="flex-1 bg-flag-py" />
          <div className="flex-1 bg-flag-br" />
        </div>
        <div aria-hidden className="absolute inset-0 grain" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-cgc-black/70 via-cgc-black/85 to-cgc-black"
        />

        <div className="container-x relative pb-20 pt-16 sm:pb-28 sm:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.4fr_1fr]">
            <div className="animate-fade-in">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cgc-orange/40 bg-cgc-orange/10 px-3 py-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cgc-orange" />
                <span className="text-xs font-semibold tracking-widest text-cgc-orangeLight">
                  PRÓXIMA PARADA · CIRCUITO MUNDIAL 2026
                </span>
              </div>

              <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-zinc-100 sm:text-7xl lg:text-[88px]">
                CGC <span className="text-cgc-orange">TRIPLE</span> FRONTERA
              </h1>
              <p className="mt-3 max-w-xl text-lg text-zinc-300 sm:text-xl">
                La edición oficial Paraguay del Circuit Global Championship 2026. Donde convergen el
                talento técnico de Argentina, Brasil y Paraguay.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-cgc-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <span><strong className="text-zinc-100">4 y 5 de Julio</strong>, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-cgc-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Hotel Gran Nobile, Ciudad del Este</span>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/inscripcion" className="btn-primary text-base">
                  Inscribirme ahora →
                </Link>
                <Link href="/evento" className="btn-secondary text-base">
                  Ver detalles del evento
                </Link>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="rounded-2xl border border-zinc-800 bg-cgc-carbon/80 p-6 backdrop-blur">
                <div className="mb-4 text-xs uppercase tracking-widest text-zinc-500">
                  Empieza en
                </div>
                <Countdown iso={startIso} />
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-zinc-800 pt-6 text-center">
                  <div>
                    <div className="font-display text-2xl text-cgc-orange">{days}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">días</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl text-zinc-100">3</div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">países</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl text-zinc-100">9</div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">sedes mundo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CIRCUITO MUNDIAL */}
      <CircuitSection />

      {/* COMPETENCIAS */}
      <section className="border-b border-zinc-900 py-20">
        <div className="container-x">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs uppercase tracking-widest text-cgc-orange">01 · Competencias</div>
              <h2 className="mt-2 font-display text-4xl text-zinc-100 sm:text-5xl">
                Tres desafíos. Reglas internacionales.
              </h2>
            </div>
            <p className="max-w-md text-sm text-zinc-400">
              Cada competencia evalúa habilidades técnicas reales bajo estándares CGC. Precisión, velocidad y calidad final.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {competitors.map((c, i) => (
              <div
                key={c.id}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-cgc-carbon p-6 transition hover:border-cgc-orange/60"
              >
                <div className="font-display text-7xl text-zinc-900 transition group-hover:text-cgc-orange/20">
                  0{i + 1}
                </div>
                <h3 className="-mt-8 font-display text-2xl tracking-wide text-zinc-100">
                  {c.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{c.description}</p>
                <div className="mt-6 flex items-baseline justify-between border-t border-zinc-800 pt-4">
                  <div>
                    <div className="text-xs text-zinc-500">Inscripción</div>
                    <div className="font-display text-2xl text-cgc-orange">
                      {formatPyg(c.price_pyg)}
                    </div>
                    <div className="text-xs text-zinc-500">o {formatUsd(c.price_usd)}</div>
                  </div>
                  <Link
                    href="/inscripcion"
                    className="text-sm font-semibold text-zinc-300 transition hover:text-cgc-orange"
                  >
                    Competir →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENTRADAS / ESPECTADORES */}
      <section className="border-b border-zinc-900 py-20">
        <div className="container-x">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-widest text-cgc-orange">02 · Entradas</div>
            <h2 className="mt-2 font-display text-4xl text-zinc-100 sm:text-5xl">
              Si no competís, vení a verlo en vivo.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {spectators.map((c) => (
              <div
                key={c.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-cgc-carbon p-7"
              >
                <div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500">
                    {c.kind === 'vip' ? 'VIP' : 'Acceso'}
                  </div>
                  <h3 className="mt-2 font-display text-3xl text-zinc-100">{c.name}</h3>
                  <p className="mt-3 max-w-md text-sm text-zinc-400">{c.description}</p>
                </div>
                <div className="mt-8 flex items-end justify-between border-t border-zinc-800 pt-5">
                  <div>
                    <div className="font-display text-3xl text-cgc-orange">{formatPyg(c.price_pyg)}</div>
                    <div className="text-xs text-zinc-500">o {formatUsd(c.price_usd)}</div>
                  </div>
                  <Link href="/inscripcion" className="btn-primary text-sm">
                    Comprar entrada
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEDE */}
      <section className="border-b border-zinc-900 py-20">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-cgc-orange">03 · Sede</div>
              <h2 className="mt-2 font-display text-4xl text-zinc-100 sm:text-5xl">
                Hotel Gran Nobile
              </h2>
              <p className="mt-3 text-lg text-zinc-300">Ciudad del Este, Paraguay</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
                Ubicado en el hub comercial de la Triple Frontera, el Hotel Gran Nobile ofrece
                arquitectura elegante y espacios profesionales para competencias tecnológicas internacionales.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
                <div className="rounded-lg border border-zinc-800 bg-cgc-carbon p-4">
                  <div className="text-xs uppercase tracking-widest text-zinc-500">Día 1</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-100">04 Julio</div>
                  <div className="mt-1 text-xs text-zinc-400">Apertura + FIXCON Expo</div>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-cgc-carbon p-4">
                  <div className="text-xs uppercase tracking-widest text-zinc-500">Día 2</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-100">05 Julio</div>
                  <div className="mt-1 text-xs text-zinc-400">Finales + Premiación</div>
                </div>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800 bg-cgc-carbon">
              <iframe
                src="https://www.google.com/maps?q=Hotel+Gran+Nobile+Ciudad+del+Este&output=embed"
                className="h-full w-full"
                loading="lazy"
                title="Mapa Hotel Gran Nobile"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl border border-cgc-orange/40 bg-gradient-to-br from-cgc-orange/15 via-cgc-carbon to-cgc-carbon p-10 sm:p-16">
            <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cgc-orange/10 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-4xl text-zinc-100 sm:text-6xl">
                Cupos limitados. <br />
                <span className="text-cgc-orange">Asegurá tu lugar.</span>
              </h2>
              <p className="mt-4 max-w-lg text-zinc-300">
                Sumate a la sede oficial del CGC en Sudamérica. Inscripción simple, pago por
                transferencia o EKO, comprobante por WhatsApp.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/inscripcion" className="btn-primary text-base">
                  Inscribirme ahora →
                </Link>
                <Link href="/evento" className="btn-secondary text-base">
                  Más información
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CircuitSection() {
  const stops = [
    { city: 'Colombia', country: 'Bogotá', date: 'May 23–24', status: 'done' },
    { city: 'Paraguay', country: 'Triple Frontera', date: 'Jul 04–05', status: 'next' },
    { city: 'India', country: 'South Asia', date: 'Ago 08–09', status: 'soon' },
    { city: 'Iraq', country: 'MENA Central', date: 'Ago 28–29', status: 'soon' },
    { city: 'Egipto', country: 'MENA East', date: 'Sep 01–02', status: 'soon' },
    { city: 'Marruecos', country: 'MENA East', date: 'Sep 05–06', status: 'soon' },
    { city: 'México', country: 'CDMX', date: 'Sep 13–14', status: 'soon' },
    { city: 'Indonesia', country: 'SE Asia', date: 'Sep 26–27', status: 'soon' },
    { city: 'China', country: 'Grand Finals', date: 'Oct 08–09', status: 'final' }
  ];

  return (
    <section className="border-b border-zinc-900 bg-gradient-to-b from-cgc-black to-cgc-carbon/50 py-20">
      <div className="container-x">
        <div className="mb-10 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <div className="text-xs uppercase tracking-widest text-cgc-orange">
              Circuito Mundial · 2026
            </div>
            <h2 className="mt-2 font-display text-4xl text-zinc-100 sm:text-5xl">
              9 sedes. <span className="text-cgc-orange">Paraguay es la próxima.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-zinc-400">
            Después de Colombia, todo el circuito CGC pone los ojos en Sudamérica.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stops.map((s) => (
            <div
              key={s.city}
              className={[
                'rounded-xl border p-4 transition',
                s.status === 'done' && 'border-zinc-800 bg-cgc-carbon/40 opacity-60',
                s.status === 'next' && 'border-cgc-orange bg-cgc-orange/10 shadow-lg shadow-cgc-orange/20',
                s.status === 'soon' && 'border-zinc-800 bg-cgc-carbon',
                s.status === 'final' && 'border-zinc-700 bg-gradient-to-br from-cgc-carbon to-zinc-900'
              ].filter(Boolean).join(' ')}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500">{s.country}</div>
                  <div className="mt-1 font-display text-2xl text-zinc-100">{s.city}</div>
                  <div className="mt-1 text-sm text-zinc-400">{s.date}</div>
                </div>
                {s.status === 'done' && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">✓ Hecho</span>
                )}
                {s.status === 'next' && (
                  <span className="rounded-full bg-cgc-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cgc-black">
                    ESTÁS ACÁ
                  </span>
                )}
                {s.status === 'final' && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cgc-orangeLight">🏆 Final</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
