export function formatPyg(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatUsd(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-PY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function daysUntil(iso: string): number {
  const target = new Date(iso).getTime();
  const now = new Date().getTime();
  const days = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending_payment: 'Pago pendiente',
    awaiting_verification: 'Esperando verificación',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado'
  };
  return labels[status] ?? status;
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    pending_payment: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
    awaiting_verification: 'bg-blue-500/20 text-blue-200 border-blue-500/40',
    confirmed: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
    cancelled: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
    refunded: 'bg-purple-500/20 text-purple-200 border-purple-500/40'
  };
  return colors[status] ?? 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40';
}
