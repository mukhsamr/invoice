import { describe, expect, it } from 'vitest';
import { calculateInvoiceTotals } from '$lib/server/invoices';
import type { InvoiceItem } from '$lib/types';

describe('calculateInvoiceTotals', () => {
	it('calculates subtotal, discount, tax, and total', () => {
		const items: InvoiceItem[] = [
			{ id: '1', invoiceId: 'i1', serviceItemId: null, name: 'Design', description: '', quantity: 2, unitPrice: 500000, lineTotal: 1000000, position: 0 },
			{ id: '2', invoiceId: 'i1', serviceItemId: null, name: 'Revision', description: '', quantity: 1, unitPrice: 250000, lineTotal: 250000, position: 1 }
		];
		const result = calculateInvoiceTotals(items, 100000, 11);
		expect(result.subtotal).toBe(1250000);
		expect(result.taxAmount).toBe(126500);
		expect(result.totalAmount).toBe(1276500);
	});
});
