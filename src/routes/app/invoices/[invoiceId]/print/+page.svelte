<script lang="ts">
	import { formatCurrency } from '$lib/utils/format';
	let { data } = $props();
</script>

<style>
	@media print {
		@page {
			size: A4;
			margin: 1cm;
		}
		
		:global(body) {
			margin: 0;
			padding: 0;
		}
		
		.print-container {
			max-width: 100%;
			padding: 0 !important;
			margin: 0 !important;
		}
		
		.print-article {
			padding: 1.5rem !important;
			page-break-after: avoid;
			page-break-inside: avoid;
		}
		
		.print-header {
			gap: 1rem !important;
			padding-bottom: 1rem !important;
		}
		
		.print-section {
			margin-top: 1rem !important;
			padding: 1rem !important;
		}
		
		.print-table {
			padding-top: 1rem !important;
			padding-bottom: 1rem !important;
		}
		
		.print-footer {
			padding-top: 1rem !important;
		}
		
		table th,
		table td {
			padding-top: 0.5rem !important;
			padding-bottom: 0.5rem !important;
		}
		
		.display-md {
			font-size: 1.75rem !important;
			margin-top: 0.5rem !important;
		}
		
		.space-y-6 > * + * {
			margin-top: 1rem !important;
		}
	}
</style>

<div class="print-container mx-auto w-full px-6 py-10">
	<div class="no-print mb-8 flex justify-end gap-4">
		<button class="btn-secondary font-black uppercase" data-testid="print-button" onclick={() => window.print()}>
			Print / Save PDF
		</button>
		<a class="btn-primary font-black uppercase" href={`/app/invoices/${data.invoice.id}`}>Back to editor</a>
	</div>

	<article class="print-article card-elevated p-12">
		<header data-testid="print-invoice-header" class="print-header flex flex-wrap items-start justify-between gap-8 border-b-4 border-black pb-10">
			<div>
				<p class="label-md text-primary font-black uppercase tracking-widest">Invoice</p>
				<h1 class="display-md mt-4 text-black font-black uppercase tracking-tight">{data.invoice.invoiceNumber}</h1>
				<div class="mt-6 space-y-1">
					<p class="body-sm text-zinc-600 font-black uppercase">Issue date: <span class="text-black">{data.invoice.issueDate}</span></p>
					<p class="body-sm text-zinc-600 font-black uppercase">Due date: <span class="text-black">{data.invoice.dueDate}</span></p>
				</div>
			</div>
			<div class="w-full md:w-[350px] text-right">
				<h2 class="title-lg text-black font-black uppercase tracking-tight">{data.profile.companyName}</h2>
				<p class="mt-4 whitespace-pre-line body-sm text-zinc-600 font-bold uppercase">{data.profile.companyAddress}</p>
				<p class="mt-2 body-sm text-zinc-600 font-bold uppercase">{data.profile.companyEmail}</p>
				<p class="body-sm text-zinc-600 font-bold uppercase">{data.profile.companyPhone}</p>
			</div>
		</header>

		<section class="print-section grid gap-8 border-b-4 border-black py-10 md:grid-cols-2">
			<div>
				<p class="label-sm text-zinc-500 font-black uppercase tracking-widest">Bill to</p>
				<h3 class="mt-4 title-lg text-black font-black uppercase">{data.invoice.customerName}</h3>
				<p class="mt-2 whitespace-pre-line body-sm text-zinc-600 font-bold uppercase">{data.invoice.customerAddress}</p>
				<p class="mt-2 body-sm text-zinc-600 font-bold uppercase">{data.invoice.customerEmail}</p>
			</div>
			<div class="md:text-right">
				<p class="label-sm text-zinc-500 font-black uppercase tracking-widest">Status</p>
				<p class="mt-4 title-lg text-black font-black uppercase">{data.invoice.status}</p>
			</div>
		</section>

		<section class="print-table py-10">
			<table class="min-w-full text-left">
				<thead>
					<tr class="border-b-4 border-black">
						<th class="py-4 label-sm font-black uppercase tracking-widest">Description</th>
						<th class="py-4 text-right label-sm font-black uppercase tracking-widest">Qty</th>
						<th class="py-4 text-right label-sm font-black uppercase tracking-widest">Rate</th>
						<th class="py-4 text-right label-sm font-black uppercase tracking-widest">Amount</th>
					</tr>
				</thead>
				<tbody class="divide-y-2 divide-black">
					{#each data.invoice.items as item}
						<tr class="align-top">
							<td class="py-6 pr-6">
								<p class="title-sm font-black text-black uppercase">{item.name}</p>
								<p class="mt-2 whitespace-pre-line body-sm text-zinc-600 font-bold uppercase">{item.description}</p>
							</td>
							<td class="py-6 text-right body-md font-black text-black">{item.quantity}</td>
							<td class="py-6 text-right body-md font-black text-black">{formatCurrency(item.unitPrice, data.invoice.currency)}</td>
							<td class="py-6 text-right body-md font-black text-black">{formatCurrency(item.lineTotal, data.invoice.currency)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>

		<section class="print-footer grid gap-10 pt-10 border-t-4 border-black md:grid-cols-[1fr_350px]">
			<div class="space-y-8">
				<div>
					<p class="label-sm text-zinc-500 font-black uppercase tracking-widest">Notes</p>
					<p class="mt-4 body-sm text-zinc-600 font-bold uppercase whitespace-pre-line">{data.invoice.notes || 'Thank you for your business.'}</p>
				</div>
				<div>
					<p class="label-sm text-zinc-500 font-black uppercase tracking-widest">Payment instructions</p>
					<p class="mt-4 body-sm text-zinc-600 font-bold uppercase whitespace-pre-line">{data.invoice.paymentInstructions}</p>
				</div>
			</div>
			<div class="space-y-4 border-l-4 border-black pl-10">
				<div class="flex justify-between body-md font-black uppercase">
					<span class="text-zinc-500">Subtotal</span>
					<span class="text-black">{formatCurrency(data.invoice.subtotal, data.invoice.currency)}</span>
				</div>
				<div class="flex justify-between body-md font-black uppercase">
					<span class="text-zinc-500">Discount</span>
					<span class="text-red-600">-{formatCurrency(data.invoice.discountAmount, data.invoice.currency)}</span>
				</div>
				<div class="flex justify-between body-md font-black uppercase">
					<span class="text-zinc-500">Tax</span>
					<span class="text-black">{formatCurrency(data.invoice.taxAmount, data.invoice.currency)}</span>
				</div>
				<div data-testid="print-total-due" class="flex justify-between mt-6 pt-6 border-t-4 border-black text-black">
					<span class="headline-sm font-black uppercase tracking-tight">Total due</span>
					<span class="headline-sm font-black uppercase tracking-tight">{formatCurrency(data.invoice.totalAmount, data.invoice.currency)}</span>
				</div>
			</div>
		</section>
	</article>
</div>
