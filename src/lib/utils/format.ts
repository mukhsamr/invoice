import type { InvoiceStatus } from '$lib/types';

export function formatCurrency(amount: number, currency = 'IDR') {
	return new Intl.NumberFormat('id-ID', { style: 'currency', currency, maximumFractionDigits: currency === 'IDR' ? 0 : 2 }).format(amount || 0);
}

export function invoiceStatusLabel(status: InvoiceStatus) {
	return status.charAt(0).toUpperCase() + status.slice(1);
}
