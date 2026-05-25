import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InscripcionForm } from './InscripcionForm';
import type { Event, EventCategory } from '@/lib/types';

export const metadata = { title: 'Inscripción · CGC Triple Frontera 2026' };

export default async function InscripcionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/registro');
  }

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
    .order('display_order')
    .returns<EventCategory[]>();

  // Inscripciones previas del usuario para mostrar status
  const { data: existing } = await supabase
    .from('registrations')
    .select('id, category_id, status, reference_code')
    .eq('user_id', user.id)
    .eq('event_id', event?.id ?? '');

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-cgc-orange">Inscripción</div>
          <h1 className="mt-2 font-display text-4xl text-zinc-100 sm:text-5xl">
            {event?.title}
          </h1>
          <p className="mt-2 text-zinc-400">
            Elegí una categoría. Luego te mostramos los datos para transferir.
          </p>
        </div>

        <InscripcionForm
          eventId={event!.id}
          categories={categories ?? []}
          existing={existing ?? []}
        />
      </div>
    </div>
  );
}
