'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function RegistroForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('PY');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // Actualizar profile con los datos extra (telefono, pais)
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ full_name: fullName, phone, whatsapp: phone, country })
        .eq('id', data.user.id);
    }

    setLoading(false);
    router.push('/mi-cuenta');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Nombre completo</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input"
          placeholder="Juan Pérez"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="tu@email.com"
          autoComplete="email"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            WhatsApp / Teléfono
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
            placeholder="+595 9XX XXX XXX"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">País</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input"
          >
            <option value="PY">🇵🇾 PY</option>
            <option value="AR">🇦🇷 AR</option>
            <option value="BR">🇧🇷 BR</option>
            <option value="OT">Otro</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Contraseña</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
        />
        <p className="mt-1 text-xs text-zinc-500">Mínimo 8 caracteres.</p>
      </div>
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Creando cuenta…' : 'Crear mi cuenta'}
      </button>
      <p className="text-center text-xs text-zinc-500">
        Al registrarte aceptás recibir notificaciones del evento.
      </p>
    </form>
  );
}
