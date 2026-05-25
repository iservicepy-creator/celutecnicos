export type EventCategory = {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  kind: 'competitor' | 'spectator' | 'vip';
  price_pyg: number | null;
  price_usd: number | null;
  capacity: number | null;
  display_order: number;
  active: boolean;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  start_date: string;
  end_date: string;
  venue_name: string | null;
  venue_address: string | null;
  city: string | null;
  country: string | null;
  status: string;
};

export type Registration = {
  id: string;
  user_id: string;
  event_id: string;
  category_id: string;
  reference_code: string;
  status:
    | 'pending_payment'
    | 'awaiting_verification'
    | 'confirmed'
    | 'cancelled'
    | 'refunded';
  amount: number;
  currency: 'PYG' | 'USD' | 'ARS' | 'BRL';
  notes: string | null;
  created_at: string;
};

export type Payment = {
  id: string;
  registration_id: string;
  user_id: string;
  amount: number;
  currency: string;
  method: 'transfer' | 'qr_bancard' | 'cash';
  bank_transaction_ref: string | null;
  receipt_url: string | null;
  sent_via_whatsapp: boolean;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
};

export type BankAccount = {
  method: 'eko' | 'bank';
  label: string;
  bank?: string;
  alias_phone?: string;
  account_number?: string;
  holder: string;
  ci?: string;
  instructions: string;
};
