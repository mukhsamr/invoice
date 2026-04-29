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
	<form method="POST" class="card-elevated no-print space-y-6 p-8">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<p class="label-md text-primary">Invoice editor</p>
				<h1 class="headline-lg mt-2 text-on-surface">{invoice.invoiceNumber}</h1>
			</div>
			<div class="flex gap-3">
				<a
					class="btn-secondary"
					data-testid="invoice-print-link"
					href={`/app/invoices/${invoice.id}/print`}
					target="_blank">Print view</a
				>
				<button class="btn-primary" data-testid="invoice-save" type="submit">Save invoice</button>
			</div>
		</div>

		<input type="hidden" name="items" value={JSON.stringify(items)} />

		<div class="grid gap-4 md:grid-cols-2">
			<input
				class="input"
				data-testid="invoice-number"
				name="invoiceNumber"
				placeholder="Invoice number"
				value={invoice.invoiceNumber}
				required
			/>
			<select class="input" data-testid="invoice-status" name="status" bind:value={status}>
				<option value="draft">Draft</option>
				<option value="issued">Issued</option>
				<option value="paid">Paid</option>
				<option value="overdue">Overdue</option>
				<option value="cancelled">Cancelled</option>
			</select>
			<select
				class="input"
				data-testid="invoice-customer"
				name="customerId"
				bind:value={customerId}
			>
				{#each customers as customer (customer.id)}
					<option value={customer.id}>{customer.name}</option>
				{/each}
			</select>
			<input
				class="input"
				data-testid="invoice-currency"
				name="currency"
				placeholder="Currency"
				value={invoice.currency}
				required
			/>
			<input
				class="input"
				data-testid="invoice-issue-date"
				name="issueDate"
				type="date"
				placeholder="Issue date"
				value={invoice.issueDate}
				required
			/>
			<input
				class="input"
				data-testid="invoice-due-date"
				name="dueDate"
				type="date"
				placeholder="Due date"
				value={invoice.dueDate}
				required
			/>
		</div>

		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="title-lg text-on-surface">Line items</h2>
				<button class="btn-secondary" data-testid="invoice-add-line" type="button" onclick={addRow}
					>Add line</button
				>
			</div>

			<div class="space-y-4">
				{#each items as item, index (item.id)}
					<div class="card p-5">
						<div class="mb-3 flex items-center justify-between">
							<p class="label-sm text-on-surface-variant">Item {index + 1}</p>
							<button
								class="btn-tertiary py-1 text-error"
								type="button"
								onclick={() => removeRow(item.id)}>Remove</button
							>
						</div>
						<div class="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)_120px_120px]">
							<select
								class="input"
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
								class="input"
								data-testid={`invoice-item-name-${index}`}
								bind:value={item.name}
								placeholder="Line item name"
							/>
							<input
								class="input"
								data-testid={`invoice-item-qty-${index}`}
								placeholder="Qty"
								bind:value={item.quantity}
								type="number"
								min="0"
								step="0.01"
							/>
							<input
								class="input"
								data-testid={`invoice-item-price-${index}`}
								placeholder="Unit price"
								bind:value={item.unitPrice}
								type="number"
								min="0"
								step="0.01"
							/>
						</div>
						<textarea
							class="input mt-3 min-h-20"
							bind:value={item.description}
							placeholder="Description"
						></textarea>
						<p class="body-md mt-3 text-right font-medium text-on-surface">
							Line total: {formatCurrency(lineTotals[index], invoice.currency)}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			<input
				class="input"
				data-testid="invoice-discount"
				name="discountAmount"
				placeholder="Discount amount"
				bind:value={discountAmount}
				type="number"
				min="0"
				step="0.01"
			/>
			<input
				class="input"
				data-testid="invoice-tax"
				name="taxPercent"
				placeholder="Tax percent"
				bind:value={taxPercent}
				type="number"
				min="0"
				step="0.01"
			/>
		</div>

		<textarea
			class="input min-h-28"
			data-testid="invoice-notes"
			name="notes"
			placeholder="Invoice notes">{invoice.notes}</textarea
		>
		<textarea
			class="input min-h-28"
			data-testid="invoice-payment-instructions"
			name="paymentInstructions"
			placeholder="Payment instructions">{invoice.paymentInstructions}</textarea
		>
	</form>

	<aside class="card-elevated p-8">
		<p class="label-md text-primary">Live totals</p>
		<div class="body-md mt-5 space-y-4 text-on-surface-variant">
			<div data-testid="invoice-subtotal" class="flex justify-between">
				<span>Subtotal</span><span class="font-medium text-on-surface"
					>{formatCurrency(subtotal, invoice.currency)}</span
				>
			</div>
			<div class="flex justify-between">
				<span>Discount</span><span class="font-medium text-on-surface"
					>-{formatCurrency(discountAmount, invoice.currency)}</span
				>
			</div>
			<div class="flex justify-between">
				<span>Tax</span><span class="font-medium text-on-surface"
					>{formatCurrency(taxAmount, invoice.currency)}</span
				>
			</div>
			<div
				data-testid="invoice-total"
				class="-mx-6 mt-4 flex justify-between bg-surface-container-low px-6 py-4 pt-4 text-base"
			>
				<span>Total</span><span class="font-semibold text-on-surface"
					>{formatCurrency(total, invoice.currency)}</span
				>
			</div>
		</div>
	</aside>
</div>
