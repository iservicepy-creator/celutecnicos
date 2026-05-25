import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Ingresar · celutecnicos' };

export default function LoginPage() {
  return (
    <div className="container-x py-20">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl text-zinc-100">Ingresar</h1>
          <p className="mt-2 text-sm text-zinc-400">Bienvenido de vuelta. Entrá con tu email y contraseña.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-zinc-400">
          ¿Todavía no tenés cuenta?{' '}
          <Link href="/auth/registro" className="text-cgc-orange hover:text-cgc-orangeLight">
            Registrate acá
          </Link>
        </p>
      </div>
    </div>
  );
}
