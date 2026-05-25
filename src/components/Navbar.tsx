import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();
    isAdmin = profile?.is_admin === true;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900/80 bg-cgc-black/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cgc-orange">
            <span className="font-display text-base text-cgc-black">CT</span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-zinc-100">celutecnicos</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/" className="btn-ghost">Inicio</Link>
          <Link href="/evento" className="btn-ghost">El evento</Link>
          <Link href="/inscripcion" className="btn-ghost">Inscripción</Link>
          {user && <Link href="/mi-cuenta" className="btn-ghost">Mi cuenta</Link>}
          {isAdmin && <Link href="/admin" className="btn-ghost text-cgc-orangeLight">Admin</Link>}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <form action="/auth/logout" method="post">
              <button type="submit" className="btn-ghost">Salir</button>
            </form>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost">Ingresar</Link>
              <Link
                href="/inscripcion"
                className="rounded-md bg-cgc-orange px-4 py-2 text-sm font-semibold text-cgc-black transition hover:bg-cgc-orangeLight"
              >
                Inscribirme
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
