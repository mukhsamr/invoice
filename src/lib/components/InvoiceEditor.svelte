<script lang="ts">
	import { formatCurrency } from '$lib/utils/format';
	import type { Customer, InvoiceWithItems, ServiceItem, InvoiceStatus } from '$lib/types';

	type DraftItem = {
		id: string;
		serviceItemId: string | null;
		name: string;
		description: string;
		quantity: number;
		unitPrice: number;
	};

	let { invoice, customers, services } = $props<{ invoice: InvoiceWithItems; customers: Customer[]; services: ServiceItem[] }>();

	function toDraftItems(source: InvoiceWithItems): DraftItem[] {
		return source.items.map((item) => ({
			id: item.id,
			serviceItemId: item.serviceItemId,
			name: item.name,
			description: item.description,
			quantity: item.quantity,
			unitPrice: item.unitPrice
		}));
	}

	let items = $state<DraftItem[]>([]);
	let discountAmount = $state<number>(0);
	let taxPercent = $state<number>(0);
	let status = $state<InvoiceStatus>('draft');
	let customerId = $state('');
	let hydratedInvoiceId = $state('');

	$effect(() => {
		if (hydratedInvoiceId === invoice.id) return;
		items = toDraftItems(invoice);
		discountAmount = invoice.discountAmount;
		taxPercent = invoice.taxPercent;
		status = invoice.status;
		customerId = invoice.customerId;
		hydratedInvoiceId = invoice.id;
	});

	const lineTotals = $derived(items.map((item) => Number(item.quantity || 0) * Number(item.unitPrice || 0)));
	const subtotal = $derived(lineTotals.reduce((sum, total) => sum + total, 0));
	const taxAmount = $derived(Math.max(0, subtotal - discountAmount) * (taxPercent / 100));
	const total = $derived(Math.max(0, subtotal - discountAmount) + taxAmount);

	function addRow() {
		items = [...items, { id: crypto.randomUUID(), serviceItemId: null, name: '', description: '', quantity: 1, unitPrice: 0 }];
	}

	function removeRow(id: string) {
		items = items.filter((item) => item.id !== id);
	}

	function applyService(index: number, serviceId: string) {
		const service = services.find((entry: ServiceItem) => entry.id === serviceId);
		if (!service) return;
		items[index] = {
			...items[index],
			serviceItemId: service.id,
			name: service.name,
			description: service.description,
			unitPrice: service.unitPrice
		};
		items = [...items];
	}
</script>

<div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
	<form method="POST" class="card no-print space-y-6 p-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<p class="text-sm font-medium text-brand-600">Invoice editor</p>
				<h1 class="mt-2 text-3xl font-semibold text-slate-900">{invoice.invoiceNumber}</h1>
			</div>
			<div class="flex gap-3">
				<a class="btn-secondary" data-testid="invoice-print-link" href={`/app/invoices/${invoice.id}/print`} target="_blank">Print view</a>
				<button class="btn-primary" data-testid="invoice-save" type="submit">Save invoice</button>
			</div>
		</div>

		<input type="hidden" name="items" value={JSON.stringify(items)} />

		<div class="grid gap-4 md:grid-cols-2">
			<input class="input" data-testid="invoice-number" name="invoiceNumber" value={invoice.invoiceNumber} required />
			<select class="input" data-testid="invoice-status" name="status" bind:value={status}>
				<option value="draft">Draft</option>
				<option value="issued">Issued</option>
				<option value="paid">Paid</option>
				<option value="overdue">Overdue</option>
				<option value="cancelled">Cancelled</option>
			</select>
			<select class="input" data-testid="invoice-customer" name="customerId" bind:value={customerId}>
				{#each customers as customer}
					<option value={customer.id}>{customer.name}</option>
				{/each}
			</select>
			<input class="input" data-testid="invoice-currency" name="currency" value={invoice.currency} required />
			<input class="input" data-testid="invoice-issue-date" name="issueDate" type="date" value={invoice.issueDate} required />
			<input class="input" data-testid="invoice-due-date" name="dueDate" type="date" value={invoice.dueDate} required />
		</div>

		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-slate-900">Line items</h2>
				<button class="btn-secondary" data-testid="invoice-add-line" type="button" onclick={addRow}>Add line</button>
			</div>

			<div class="space-y-4">
				{#each items as item, index}
					<div class="rounded-3xl border border-slate-100 p-4">
						<div class="mb-3 flex items-center justify-between">
							<p class="text-sm font-medium text-slate-700">Item {index + 1}</p>
							<button class="text-sm font-medium text-rose-600" type="button" onclick={() => removeRow(item.id)}>Remove</button>
						</div>
						<div class="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)_120px_120px]">
							<select class="input" value={item.serviceItemId ?? ''} onchange={(event) => applyService(index, (event.currentTarget as HTMLSelectElement).value)}>
								<option value="">Custom line</option>
								{#each services as service}
									<option value={service.id}>{service.name}</option>
								{/each}
							</select>
							<input class="input" data-testid={`invoice-item-name-${index}`} bind:value={item.name} placeholder="Line item name" />
							<input class="input" data-testid={`invoice-item-qty-${index}`} bind:value={item.quantity} type="number" min="0" step="0.01" />
							<input class="input" data-testid={`invoice-item-price-${index}`} bind:value={item.unitPrice} type="number" min="0" step="0.01" />
						</div>
						<textarea class="input mt-3 min-h-20" bind:value={item.description} placeholder="Description"></textarea>
						<p class="mt-3 text-right text-sm font-medium text-slate-900">Line total: {formatCurrency(lineTotals[index], invoice.currency)}</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			<input class="input" data-testid="invoice-discount" name="discountAmount" bind:value={discountAmount} type="number" min="0" step="0.01" />
			<input class="input" data-testid="invoice-tax" name="taxPercent" bind:value={taxPercent} type="number" min="0" step="0.01" />
		</div>

		<textarea class="input min-h-28" data-testid="invoice-notes" name="notes">{invoice.notes}</textarea>
		<textarea class="input min-h-28" data-testid="invoice-payment-instructions" name="paymentInstructions">{invoice.paymentInstructions}</textarea>
	</form>

	<aside class="card p-6">
		<p class="text-sm font-medium text-brand-600">Live totals</p>
		<div class="mt-5 space-y-4 text-sm text-slate-600">
			<div data-testid="invoice-subtotal" class="flex justify-between"><span>Subtotal</span><span class="font-medium text-slate-900">{formatCurrency(subtotal, invoice.currency)}</span></div>
			<div class="flex justify-between"><span>Discount</span><span class="font-medium text-slate-900">-{formatCurrency(discountAmount, invoice.currency)}</span></div>
			<div class="flex justify-between"><span>Tax</span><span class="font-medium text-slate-900">{formatCurrency(taxAmount, invoice.currency)}</span></div>
			<div data-testid="invoice-total" class="flex justify-between border-t border-slate-100 pt-4 text-base"><span>Total</span><span class="font-semibold text-slate-900">{formatCurrency(total, invoice.currency)}</span></div>
		</div>
	</aside>
</div>
