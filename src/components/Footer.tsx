import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function Footer() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['whatsapp_number', 'contact_email']);

  const map: Record<string, any> = {};
  settings?.forEach((s) => (map[s.key] = s.value));
  const wa = map['whatsapp_number']?.toString().replace(/[^\d+]/g, '');
  const email = map['contact_email'];

  return (
    <footer className="border-t border-zinc-900 bg-cgc-black">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-cgc-orange">
              <span className="font-display text-lg text-cgc-black">CT</span>
            </div>
            <span className="font-semibold tracking-wide">celutecnicos</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-zinc-500">
            Comunidad de técnicos en celulares de Paraguay. Sede oficial de CGC Triple Frontera 2026.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Navegar
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-zinc-400 hover:text-zinc-100">Inicio</Link></li>
            <li><Link href="/evento" className="text-zinc-400 hover:text-zinc-100">El evento</Link></li>
            <li><Link href="/inscripcion" className="text-zinc-400 hover:text-zinc-100">Inscripción</Link></li>
            <li><Link href="/mi-cuenta" className="text-zinc-400 hover:text-zinc-100">Mi cuenta</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Contacto
          </h4>
          <ul className="space-y-2 text-sm">
            {wa && (
              <li>
                <a
                  href={`https://wa.me/${wa.replace('+', '')}`}
                  target="_blank"
                  className="text-zinc-400 hover:text-zinc-100"
                >
                  WhatsApp: {wa}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="text-zinc-400 hover:text-zinc-100">
                  {String(email)}
                </a>
              </li>
            )}
            <li>
              <a
                href="https://joincgc.com"
                target="_blank"
                className="text-zinc-400 hover:text-zinc-100"
              >
                Sitio oficial CGC
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Organizan
          </h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>KikeCell</li>
            <li>G-LON</li>
            <li>FIXCON</li>
            <li>CGC World Cup</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-900">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-4 text-xs text-zinc-600 sm:flex-row">
          <span>© {new Date().getFullYear()} celutecnicos.com · Todos los derechos reservados.</span>
          <span>CGC Triple Frontera 2026 · Triple Frontera</span>
        </div>
      </div>
    </footer>
  );
}
