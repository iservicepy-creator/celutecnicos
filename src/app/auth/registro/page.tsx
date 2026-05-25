import Link from 'next/link';
import { RegistroForm } from './RegistroForm';

export const metadata = { title: 'Crear cuenta · celutecnicos' };

export default function RegistroPage() {
  return (
    <div className="container-x py-20">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl text-zinc-100">Crear cuenta</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Registrate gratis para inscribirte al CGC Triple Frontera 2026.
          </p>
        </div>
        <RegistroForm />
        <p className="mt-6 text-center text-sm text-zinc-400">
          ¿Ya tenés cuenta?{' '}
          <Link href="/auth/login" className="text-cgc-orange hover:text-cgc-orangeLight">
            Ingresá acá
          </Link>
        </p>
      </div>
    </div>
  );
}
