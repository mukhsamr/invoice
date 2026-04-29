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

	let { invoice, customers, services } = $props<{
		invoice: InvoiceWithItems;
		customers: Customer[];
		services: ServiceItem[];
	}>();

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

	const lineTotals = $derived(
		items.map((item) => Number(item.quantity || 0) * Number(item.unitPrice || 0))
	);
	const subtotal = $derived(lineTotals.reduce((sum, total) => sum + total, 0));
	const taxAmount = $derived(Math.max(0, subtotal - discountAmount) * (taxPercent / 100));
	const total = $derived(Math.max(0, subtotal - discountAmount) + taxAmount);

	function addRow() {
		items = [
			...items,
			{
				id: crypto.randomUUID(),
				serviceItemId: null,
				name: '',
				description: '',
				quantity: 1,
				unitPrice: 0
			}
		];
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
	<form method="POST" class="card-elevated no-print space-y-8 p-10">
		<div class="flex flex-wrap items-center justify-between gap-6">
			<div>
				<p class="label-md text-primary font-black uppercase tracking-widest">Invoice editor</p>
				<h1 class="headline-lg mt-2 text-black font-black uppercase tracking-tight">{invoice.invoiceNumber}</h1>
			</div>
			<div class="flex gap-4">
				<a
					class="btn-secondary px-6"
					data-testid="invoice-print-link"
					href={`/app/invoices/${invoice.id}/print`}
					target="_blank">Print view</a
				>
				<button class="btn-primary px-6 font-black uppercase" data-testid="invoice-save" type="submit">Save</button>
			</div>
		</div>

		<input type="hidden" name="items" value={JSON.stringify(items)} />

		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-2">
				<label class="label-sm font-black uppercase tracking-widest">Invoice Number</label>
				<input
					class="input border-4 border-black font-black uppercase"
					data-testid="invoice-number"
					name="invoiceNumber"
					placeholder="INV-001"
					value={invoice.invoiceNumber}
					required
				/>
			</div>
			<div class="space-y-2">
				<label class="label-sm font-black uppercase tracking-widest">Status</label>
				<select class="input border-4 border-black font-black uppercase" data-testid="invoice-status" name="status" bind:value={status}>
					<option value="draft">Draft</option>
					<option value="issued">Issued</option>
					<option value="paid">Paid</option>
					<option value="overdue">Overdue</option>
					<option value="cancelled">Cancelled</option>
				</select>
			</div>
			<div class="space-y-2">
				<label class="label-sm font-black uppercase tracking-widest">Customer</label>
				<select
					class="input border-4 border-black font-black uppercase"
					data-testid="invoice-customer"
					name="customerId"
					bind:value={customerId}
				>
					{#each customers as customer (customer.id)}
						<option value={customer.id}>{customer.name}</option>
					{/each}
				</select>
			</div>
			<div class="space-y-2">
				<label class="label-sm font-black uppercase tracking-widest">Currency</label>
				<input
					class="input border-4 border-black font-black uppercase"
					data-testid="invoice-currency"
					name="currency"
					placeholder="USD"
					value={invoice.currency}
					required
				/>
			</div>
			<div class="space-y-2">
				<label class="label-sm font-black uppercase tracking-widest">Issue Date</label>
				<input
					class="input border-4 border-black font-black uppercase"
					data-testid="invoice-issue-date"
					name="issueDate"
					type="date"
					value={invoice.issueDate}
					required
				/>
			</div>
			<div class="space-y-2">
				<label class="label-sm font-black uppercase tracking-widest">Due Date</label>
				<input
					class="input border-4 border-black font-black uppercase"
					data-testid="invoice-due-date"
					name="dueDate"
					type="date"
					value={invoice.dueDate}
					required
				/>
			</div>
		</div>

		<div class="space-y-6">
			<div class="flex items-center justify-between border-b-4 border-black pb-4">
				<h2 class="title-lg text-black font-black uppercase tracking-tight">Line items</h2>
				<button class="btn-secondary px-6 font-black uppercase" data-testid="invoice-add-line" type="button" onclick={addRow}
					>Add Item</button
				>
			</div>

			<div class="space-y-6">
				{#each items as item, index (item.id)}
					<div class="card p-6 border-2 border-black bg-white">
						<div class="mb-4 flex items-center justify-between">
							<p class="label-sm font-black uppercase text-zinc-500 tracking-widest">Item {index + 1}</p>
							<button
								class="btn-danger py-1 px-4 text-xs font-black uppercase"
								type="button"
								onclick={() => removeRow(item.id)}>Remove</button
							>
						</div>
						<div class="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_100px_140px]">
							<select
								class="input border-2 border-black font-bold uppercase"
								value={item.serviceItemId ?? ''}
								onchange={(event) =>
									applyService(index, (event.currentTarget as HTMLSelectElement).value)}
							>
								<option value="">Custom line</option>
								{#each services as service (service.id)}
									<option value={service.id}>{service.name}</option>
								{/each}
							</select>
							<input
								class="input border-2 border-black font-bold uppercase"
								data-testid={`invoice-item-name-${index}`}
								bind:value={item.name}
								placeholder="Item Name"
							/>
							<input
								class="input border-2 border-black font-bold uppercase text-center"
								data-testid={`invoice-item-qty-${index}`}
								placeholder="Qty"
								bind:value={item.quantity}
								type="number"
								min="0"
								step="0.01"
							/>
							<input
								class="input border-2 border-black font-bold uppercase"
								data-testid={`invoice-item-price-${index}`}
								placeholder="Price"
								bind:value={item.unitPrice}
								type="number"
								min="0"
								step="0.01"
							/>
						</div>
						<textarea
							class="input mt-4 min-h-20 border-2 border-black font-bold uppercase"
							bind:value={item.description}
							placeholder="Description"
						></textarea>
						<div class="mt-4 flex justify-end border-t-2 border-black pt-4">
							<p class="body-md font-black text-black uppercase tracking-widest">
								Line total: <span class="text-primary">{formatCurrency(lineTotals[index], invoice.currency)}</span>
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-2">
				<label class="label-sm font-black uppercase tracking-widest">Discount Amount</label>
				<input
					class="input border-4 border-black font-black uppercase"
					data-testid="invoice-discount"
					name="discountAmount"
					placeholder="0.00"
					bind:value={discountAmount}
					type="number"
					min="0"
					step="0.01"
				/>
			</div>
			<div class="space-y-2">
				<label class="label-sm font-black uppercase tracking-widest">Tax Percent (%)</label>
				<input
					class="input border-4 border-black font-black uppercase"
					data-testid="invoice-tax"
					name="taxPercent"
					placeholder="0"
					bind:value={taxPercent}
					type="number"
					min="0"
					step="0.01"
				/>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-2">
				<label class="label-sm font-black uppercase tracking-widest">Notes</label>
				<textarea
					class="input min-h-28 border-4 border-black font-black uppercase"
					data-testid="invoice-notes"
					name="notes"
					placeholder="Enter notes...">{invoice.notes}</textarea
				>
			</div>
			<div class="space-y-2">
				<label class="label-sm font-black uppercase tracking-widest">Payment Instructions</label>
				<textarea
					class="input min-h-28 border-4 border-black font-black uppercase"
					data-testid="invoice-payment-instructions"
					name="paymentInstructions"
					placeholder="Enter instructions...">{invoice.paymentInstructions}</textarea
				>
			</div>
		</div>
	</form>

	<aside class="card-elevated p-10 h-max sticky top-8">
		<p class="label-md text-primary font-black uppercase tracking-widest">Live totals</p>
		<div class="body-md mt-8 space-y-6 text-black font-black uppercase">
			<div data-testid="invoice-subtotal" class="flex justify-between border-b-2 border-black pb-2">
				<span>Subtotal</span>
				<span>{formatCurrency(subtotal, invoice.currency)}</span>
			</div>
			<div class="flex justify-between border-b-2 border-black pb-2">
				<span>Discount</span>
				<span class="text-red-600">-{formatCurrency(discountAmount, invoice.currency)}</span>
			</div>
			<div class="flex justify-between border-b-2 border-black pb-2">
				<span>Tax</span>
				<span>{formatCurrency(taxAmount, invoice.currency)}</span>
			</div>
			<div
				data-testid="invoice-total"
				class="-mx-10 mt-10 flex justify-between bg-primary p-10 text-white border-y-4 border-black"
			>
				<span class="headline-sm">Total</span>
				<span class="headline-sm">{formatCurrency(total, invoice.currency)}</span>
			</div>
		</div>
	</aside>
</div>
