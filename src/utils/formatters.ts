export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5); // HH:MM
}

export function formatDateTime(dateStr: string, timeStr: string): string {
  const date = new Date(`${dateStr}T${timeStr}`);
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getBookingStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    noShow: 'No se presentó',
  };
  return statusMap[status] || status;
}

export function getPaymentStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    unpaid: 'Sin pagar',
    deposit: 'Seña pagada',
    paid: 'Pagada',
  };
  return statusMap[status] || status;
}

export function getPaymentMethodText(method: string): string {
  const methodMap: Record<string, string> = {
    cash: 'Efectivo',
    transfer: 'Transferencia',
    mp: 'Mercado Pago',
    card: 'Tarjeta',
  };
  return methodMap[method] || method;
}