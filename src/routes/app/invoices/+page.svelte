<script lang="ts">
	import { FileText } from 'lucide-svelte';
	import { formatCurrency } from "$lib/utils/format";
	import { invoiceStatusLabel } from "$lib/utils/format";

	let { data } = $props();
</script>

<section class="card-elevated no-print flex flex-wrap items-center justify-between gap-6 p-8">
	<div>
		<p class="label-md text-primary font-black uppercase tracking-widest">Invoices</p>
		<h1 class="headline-lg mt-2 text-black font-black">Track drafts, issued invoices, and payments</h1>
	</div>
	<form method="POST" action="?/create">
		<button class="btn-primary" data-testid="invoice-create" type="submit">Create invoice</button>
	</form>
</section>

<section class="card-elevated no-print p-6">
	<form method="GET" class="flex flex-col gap-6 md:flex-row">
		<input class="input flex-1 border-4 border-black font-black uppercase tracking-tight" name="q" placeholder="Search invoice number or customer" value={data.query} />
		<button class="btn-secondary md:w-max font-black uppercase" type="submit">Filter</button>
	</form>
</section>

<section class="card-elevated overflow-hidden p-0">
	{#if data.invoices.length === 0}
		<div class="p-20 text-center">
			<FileText class="mx-auto h-20 w-20 text-zinc-200" />
			<p class="body-md mt-6 text-zinc-400 font-black uppercase">No invoices found.</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="min-w-full text-left">
				<thead class="bg-black border-b-4 border-black">
					<tr>
						<th class="label-sm px-6 py-6 text-white uppercase tracking-widest font-black">Invoice</th>
						<th class="label-sm px-6 py-6 text-white uppercase tracking-widest font-black">Customer</th>
						<th class="label-sm px-6 py-6 text-white uppercase tracking-widest font-black">Status</th>
						<th class="label-sm px-6 py-6 text-white uppercase tracking-widest font-black">Due date</th>
						<th class="label-sm px-6 py-6 text-white uppercase tracking-widest font-black">Total</th>
						<th class="label-sm px-6 py-6 text-white uppercase tracking-widest font-black text-center">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y-4 divide-black">
					{#each data.invoices as invoice}
						<tr class="transition-all hover:bg-zinc-50">
							<td class="px-6 py-6">
								<a class="body-md font-black text-primary hover:underline uppercase" href="/app/invoices/{invoice.id}">{invoice.invoiceNumber}</a>
							</td>
							<td class="body-md px-6 py-6 text-black font-black uppercase">{invoice.customerName}</td>
							<td class="px-6 py-6">
								<span class="badge badge-{invoice.status}">{invoiceStatusLabel(invoice.status)}</span>
							</td>
							<td class="body-md px-6 py-6 text-zinc-600 font-bold uppercase">{invoice.dueDate}</td>
							<td class="body-md px-6 py-6 font-black text-black">{formatCurrency(invoice.totalAmount, invoice.currency)}</td>
							<td class="px-6 py-6">
								<div class="flex flex-wrap items-center justify-center gap-3">
									<a class="btn-secondary py-2 px-4 text-xs font-black uppercase" href="/app/invoices/{invoice.id}">Open</a>
									<form method="POST" action="?/duplicate">
										<input type="hidden" name="id" value={invoice.id} />
										<button class="btn-secondary py-2 px-4 text-xs font-black uppercase" type="submit">Copy</button>
									</form>
									<form method="POST" action="?/delete">
										<input type="hidden" name="id" value={invoice.id} />
										<button class="btn-danger py-2 px-4 text-xs font-black uppercase border-2 border-red-600" type="submit">Del</button>
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
