<script lang="ts">
	import { CircleDollarSign, Clock3, FileText, ReceiptText, Users } from 'lucide-svelte';
	import { formatCurrency } from "$lib/utils/format";
	import { invoiceStatusLabel } from "$lib/utils/format";
	let { data } = $props();
	const stats = $derived([
		{ label: "Paid revenue", value: formatCurrency(data.metrics.totalRevenue, data.profile.defaultCurrency), icon: CircleDollarSign },
		{ label: "Outstanding", value: formatCurrency(data.metrics.outstandingRevenue, data.profile.defaultCurrency), icon: ReceiptText },
		{ label: "Customers", value: String(data.customerCount), icon: Users },
		{ label: "Overdue invoices", value: String(data.metrics.overdueInvoices), icon: Clock3 }
	]);
</script>

<section class="card-elevated no-print p-8">
	<div class="flex flex-wrap items-start justify-between gap-6">
		<div class="space-y-3">
			<p class="label-md text-primary font-black uppercase tracking-widest">Dashboard</p>
			<h1 class="headline-lg text-black font-black">Overview</h1>
			<p class="body-lg text-zinc-600 font-bold">Track payments, create invoices, and keep your business profile ready for PDF export.</p>
		</div>
		<div class="flex gap-4">
			<a class="btn-secondary" href="/app/customers">Add customer</a>
			<a class="btn-primary" href="/app/invoices/new">Create invoice</a>
		</div>
	</div>
</section>

<section class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
	{#each stats as stat}
		<div class="card group p-6">
			<div class="flex items-start justify-between">
				<div class="flex h-14 w-14 items-center justify-center rounded-none bg-primary text-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
					<stat.icon class="h-7 w-7" />
				</div>
			</div>
			<p class="label-sm mt-6 text-zinc-500 font-black uppercase tracking-widest">{stat.label}</p>
			<p class="headline-md mt-2 text-black font-black">{stat.value}</p>
		</div>
	{/each}
</section>

<section class="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
	<div class="card-elevated p-8">
		<div class="mb-8 flex items-center justify-between">
			<h2 class="headline-sm text-black font-black uppercase tracking-tight">Recent invoices</h2>
			<a href="/app/invoices" class="btn-tertiary py-2 text-sm font-black underline uppercase">View all</a>
		</div>
		{#if data.recentInvoices.length === 0}
			<div class="rounded-none border-4 border-dashed border-zinc-200 p-12 text-center">
				<FileText class="mx-auto h-16 w-16 text-zinc-200" />
				<p class="body-md mt-6 text-zinc-400 font-bold uppercase">No invoices yet.</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each data.recentInvoices as invoice}
					<a href="/app/invoices/{invoice.id}" class="flex items-center justify-between rounded-none border-2 border-black p-5 transition-all hover:translate-x-1 hover:bg-zinc-50">
						<div>
							<p class="body-lg font-black text-black">{invoice.invoiceNumber}</p>
							<p class="body-sm mt-1 text-zinc-600 font-bold">{invoice.customerName}</p>
						</div>
						<div class="flex items-center gap-6">
							<span class="badge badge-{invoice.status}">{invoiceStatusLabel(invoice.status)}</span>
							<p class="title-lg font-black text-black">{formatCurrency(invoice.totalAmount, invoice.currency)}</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
	<div class="card-elevated p-8">
		<h2 class="headline-sm text-black font-black uppercase tracking-tight">Business profile</h2>
		<div class="mt-8 space-y-8">
			<div class="border-b-4 border-black pb-6">
				<p class="label-sm text-zinc-500 font-black uppercase tracking-widest">Default currency</p>
				<p class="title-md mt-2 font-black text-black">{data.profile.defaultCurrency}</p>
			</div>
			<div class="border-b-4 border-black pb-6">
				<p class="label-sm text-zinc-500 font-black uppercase tracking-widest">Invoice prefix</p>
				<p class="title-md mt-2 font-black text-black">{data.profile.invoicePrefix}</p>
			</div>
			<div class="pb-6">
				<p class="label-sm text-zinc-500 font-black uppercase tracking-widest">Payment instructions</p>
				<p class="body-md mt-2 whitespace-pre-line text-black font-bold">{data.profile.paymentInstructions}</p>
			</div>
			<a href="/app/settings" class="btn-secondary w-full justify-center">Edit settings</a>
		</div>
	</div>
</section>
