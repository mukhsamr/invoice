<script lang="ts">
	import { formatCurrency } from "$lib/utils/format";
	import { invoiceStatusLabel } from "$lib/utils/format";
	let { data } = $props();
	const stats = $derived([
		{ label: "Paid revenue", value: formatCurrency(data.metrics.totalRevenue, data.profile.defaultCurrency), icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
		{ label: "Outstanding", value: formatCurrency(data.metrics.outstandingRevenue, data.profile.defaultCurrency), icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
		{ label: "Customers", value: String(data.customerCount), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
		{ label: "Overdue invoices", value: String(data.metrics.overdueInvoices), icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }
	]);
</script>

<section class="card-elevated no-print p-8">
	<div class="flex flex-wrap items-start justify-between gap-6">
		<div class="space-y-3">
			<p class="label-md text-primary">Dashboard</p>
			<h1 class="headline-lg text-on-surface">Welcome back, keep billing simple.</h1>
			<p class="body-lg text-on-surface-variant">Track payments, create invoices, and keep your business profile ready for PDF export.</p>
		</div>
		<div class="flex gap-3">
			<a class="btn-secondary" href="/app/customers">Add customer</a>
			<a class="btn-primary" href="/app/invoices/new">Create invoice</a>
		</div>
	</div>
</section>

<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
	{#each stats as stat}
		<div class="card group p-6">
			<div class="flex items-start justify-between">
				<div class="flex h-12 w-12 items-center justify-center rounded-sm bg-primary-fixed-dim/20 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={stat.icon} />
					</svg>
				</div>
			</div>
			<p class="label-sm mt-4 text-on-surface-variant">{stat.label}</p>
			<p class="headline-md mt-2 text-on-surface">{stat.value}</p>
		</div>
	{/each}
</section>

<section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
	<div class="card-elevated p-8">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="title-lg text-on-surface">Recent invoices</h2>
			<a href="/app/invoices" class="btn-tertiary py-2 text-sm">View all</a>
		</div>
		{#if data.recentInvoices.length === 0}
			<div class="rounded-sm bg-surface-container-low p-12 text-center">
				<svg class="mx-auto h-12 w-12 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<p class="body-md mt-4 text-on-surface-variant">No invoices yet. Create your first invoice to start tracking revenue.</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each data.recentInvoices as invoice}
					<a href="/app/invoices/{invoice.id}" class="flex items-center justify-between rounded-sm bg-surface-container-lowest p-4 transition-all hover:bg-surface-bright hover:shadow-ambient-sm">
						<div>
							<p class="body-md font-medium text-on-surface">{invoice.invoiceNumber}</p>
							<p class="body-sm mt-1 text-on-surface-variant">{invoice.customerName}</p>
						</div>
						<div class="text-right">
							<span class="badge badge-{invoice.status}">{invoiceStatusLabel(invoice.status)}</span>
							<p class="body-md mt-2 font-medium text-on-surface">{formatCurrency(invoice.totalAmount, invoice.currency)}</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
	<div class="card-elevated p-8">
		<h2 class="title-lg text-on-surface">Business profile</h2>
		<div class="mt-6 space-y-6">
			<div>
				<p class="label-sm text-on-surface-variant">Default currency</p>
				<p class="body-md mt-2 font-medium text-on-surface">{data.profile.defaultCurrency}</p>
			</div>
			<div>
				<p class="label-sm text-on-surface-variant">Invoice prefix</p>
				<p class="body-md mt-2 font-medium text-on-surface">{data.profile.invoicePrefix}</p>
			</div>
			<div>
				<p class="label-sm text-on-surface-variant">Payment instructions</p>
				<p class="body-md mt-2 whitespace-pre-line text-on-surface">{data.profile.paymentInstructions}</p>
			</div>
			<a href="/app/settings" class="btn-secondary w-full justify-center">Edit settings</a>
		</div>
	</div>
</section>
