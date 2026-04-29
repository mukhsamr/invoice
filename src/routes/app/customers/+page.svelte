<script lang="ts">
	import { Users } from 'lucide-svelte';

	let { data, form } = $props();
</script>

<section class="card-elevated no-print p-8">
	<p class="label-md text-primary font-black uppercase tracking-widest">Customers</p>
	<h1 class="headline-lg mt-2 text-black font-black">Manage your billing contacts</h1>
</section>

<section class="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
	<form method="POST" action="?/create" data-testid="customer-create-form" class="card-elevated space-y-6 p-8">
		<div>
			<h2 class="title-lg text-black font-black uppercase tracking-tight">New customer</h2>
			<p class="body-md mt-2 text-zinc-600 font-bold uppercase">Add a new billing contact to your workspace.</p>
		</div>
		{#if form?.message}
			<p class="rounded-none border-4 border-red-600 bg-white px-4 py-3 text-sm text-red-600 font-black uppercase">{form.message}</p>
		{/if}
		<input class="input border-4 border-black font-black uppercase" data-testid="customer-name" name="name" placeholder="Customer name" required />
		<input class="input border-4 border-black font-black uppercase" data-testid="customer-company" name="company" placeholder="Company" />
		<input class="input border-4 border-black font-black uppercase" data-testid="customer-email" name="email" type="email" placeholder="Email" />
		<input class="input border-4 border-black font-black uppercase" data-testid="customer-phone" name="phone" placeholder="Phone" />
		<textarea class="input min-h-28 border-4 border-black font-black uppercase" data-testid="customer-address" name="address" placeholder="Billing address"></textarea>
		<textarea class="input min-h-24 border-4 border-black font-black uppercase" data-testid="customer-notes" name="notes" placeholder="Notes"></textarea>
		<button class="btn-primary w-full font-black uppercase py-4" data-testid="customer-save" type="submit">Save customer</button>
	</form>

	<div class="card-elevated p-8">
		<div class="mb-8 flex items-center justify-between">
			<h2 class="headline-sm text-black font-black uppercase tracking-tight">Customer list</h2>
			<a class="btn-tertiary py-2 text-sm font-black underline uppercase" href="?archived=1">View archived</a>
		</div>
		{#if data.customers.length === 0}
			<div data-testid="customers-empty-state" class="rounded-none border-4 border-dashed border-zinc-200 p-12 text-center bg-white">
				<Users class="mx-auto h-16 w-16 text-zinc-200" />
				<p class="body-md mt-6 text-zinc-400 font-black uppercase">No customers yet.</p>
			</div>
		{:else}
			<div class="space-y-6">
				{#each data.customers as customer}
					<div class="card" data-testid="customer-card-{customer.id}">
						<div class="flex flex-wrap items-start justify-between gap-4">
							<div>
								<p class="title-md font-black text-black uppercase">{customer.name}</p>
								<p class="body-md mt-1 text-zinc-600 font-black uppercase">{customer.company || customer.email || 'No company'}</p>
							</div>
							<form method="POST" action="?/archive">
								<input type="hidden" name="id" value={customer.id} />
								<button class="btn-danger py-2 px-4 text-xs font-black uppercase" type="submit">Archive</button>
							</form>
						</div>
						<form method="POST" action="?/update" class="mt-8 grid gap-4 md:grid-cols-2">
							<input type="hidden" name="id" value={customer.id} />
							<input class="input border-2 border-black font-bold" name="name" placeholder="Customer name" value={customer.name} required />
							<input class="input border-2 border-black font-bold" name="company" placeholder="Company" value={customer.company} />
							<input class="input border-2 border-black font-bold" name="email" type="email" placeholder="Email" value={customer.email} />
							<input class="input border-2 border-black font-bold" name="phone" placeholder="Phone" value={customer.phone} />
							<textarea class="input min-h-24 md:col-span-2 border-2 border-black font-bold" name="address" placeholder="Billing address">{customer.address}</textarea>
							<textarea class="input min-h-20 md:col-span-2 border-2 border-black font-bold" name="notes" placeholder="Notes">{customer.notes}</textarea>
							<button class="btn-secondary md:w-max px-6 font-black uppercase" data-testid="customer-update-{customer.id}" type="submit">Update</button>
						</form>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
