<script lang="ts">import { formatCurrency } from "$lib/utils/format"; import { invoiceStatusLabel } from "$lib/utils/format"; let { data } = $props();</script>

<section class="card-elevated no-print flex flex-wrap items-center justify-between gap-6 p-8">
	<div>
		<p class="label-md text-primary">Invoices</p>
		<h1 class="headline-lg mt-2 text-on-surface">Track drafts, issued invoices, and payments</h1>
	</div>
	<form method="POST" action="?/create">
		<button class="btn-primary" data-testid="invoice-create" type="submit">Create invoice</button>
	</form>
</section>

<section class="card-elevated no-print p-6">
	<form method="GET" class="flex flex-col gap-3 md:flex-row">
		<input class="input flex-1" name="q" placeholder="Search invoice number or customer" value={data.query} />
		<button class="btn-secondary md:w-max" type="submit">Filter</button>
	</form>
</section>

<section class="card-elevated overflow-hidden p-0">
	{#if data.invoices.length === 0}
		<div class="p-12 text-center">
			<svg class="mx-auto h-12 w-12 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<p class="body-md mt-4 text-on-surface-variant">No invoices yet. Create one to start billing.</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="min-w-full text-left">
				<thead class="bg-surface-container-low">
					<tr>
						<th class="label-sm px-6 py-4 text-on-surface-variant">Invoice</th>
						<th class="label-sm px-6 py-4 text-on-surface-variant">Customer</th>
						<th class="label-sm px-6 py-4 text-on-surface-variant">Status</th>
						<th class="label-sm px-6 py-4 text-on-surface-variant">Due date</th>
						<th class="label-sm px-6 py-4 text-on-surface-variant">Total</th>
						<th class="label-sm px-6 py-4 text-on-surface-variant">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.invoices as invoice}
						<tr class=" transition-colors hover:bg-surface-container-lowest">
							<td class="px-6 py-4">
								<a class="body-md font-medium text-primary hover:underline" href="/app/invoices/{invoice.id}">{invoice.invoiceNumber}</a>
							</td>
							<td class="body-md px-6 py-4 text-on-surface">{invoice.customerName}</td>
							<td class="px-6 py-4">
								<span class="badge badge-{invoice.status}">{invoiceStatusLabel(invoice.status)}</span>
							</td>
							<td class="body-md px-6 py-4 text-on-surface-variant">{invoice.dueDate}</td>
							<td class="body-md px-6 py-4 font-medium text-on-surface">{formatCurrency(invoice.totalAmount, invoice.currency)}</td>
							<td class="px-6 py-4">
								<div class="flex flex-wrap gap-2">
									<a class="btn-secondary py-2 text-sm" href="/app/invoices/{invoice.id}">Open</a>
									<form method="POST" action="?/duplicate">
										<input type="hidden" name="id" value={invoice.id} />
										<button class="btn-secondary py-2 text-sm" type="submit">Duplicate</button>
									</form>
									<form method="POST" action="?/delete">
										<input type="hidden" name="id" value={invoice.id} />
										<button class="btn-danger py-2 text-sm" type="submit">Delete</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>
