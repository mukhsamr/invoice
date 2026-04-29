import type { InvoiceItem, InvoiceStatus } from '$lib/types';

export function normalizeNumber(value: FormDataEntryValue | string | null | undefined, fallback = 0) {
	const parsed = Number(value ?? fallback);
	return Number.isFinite(parsed) ? parsed : fallback;
}

export function calculateInvoiceTotals(items: InvoiceItem[], discountAmount: number, taxPercent: number) {
	const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
	const safeDiscount = Math.max(0, discountAmount);
	const taxableBase = Math.max(0, subtotal - safeDiscount);
	const safeTaxPercent = Math.max(0, taxPercent);
	const taxAmount = (taxableBase * safeTaxPercent) / 100;
	const totalAmount = taxableBase + taxAmount;

	return {
		subtotal,
		discountAmount: safeDiscount,
		taxPercent: safeTaxPercent,
		taxAmount,
		totalAmount
	};
}

export function invoiceStatusLabel(status: InvoiceStatus) {
	return status.charAt(0).toUpperCase() + status.slice(1);
}
