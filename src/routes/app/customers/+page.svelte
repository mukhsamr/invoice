<script lang="ts">let { data, form } = $props();</script>

<section class="card-elevated no-print p-8">
	<p class="label-md text-primary">Customers</p>
	<h1 class="headline-lg mt-2 text-on-surface">Manage your billing contacts</h1>
</section>

<section class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
	<form method="POST" action="?/create" data-testid="customer-create-form" class="card-elevated space-y-5 p-8">
		<div>
			<h2 class="title-lg text-on-surface">New customer</h2>
			<p class="body-md mt-2 text-on-surface-variant">Add a new billing contact to your workspace.</p>
		</div>
		{#if form?.message}
			<p class="rounded-sm bg-error-container px-4 py-3 text-sm text-on-error-container">{form.message}</p>
		{/if}
		<input class="input" data-testid="customer-name" name="name" placeholder="Customer name" required />
		<input class="input" data-testid="customer-company" name="company" placeholder="Company" />
		<input class="input" data-testid="customer-email" name="email" type="email" placeholder="Email" />
		<input class="input" data-testid="customer-phone" name="phone" placeholder="Phone" />
		<textarea class="input min-h-28" data-testid="customer-address" name="address" placeholder="Billing address"></textarea>
		<textarea class="input min-h-24" data-testid="customer-notes" name="notes" placeholder="Notes"></textarea>
		<button class="btn-primary w-full" data-testid="customer-save" type="submit">Save customer</button>
	</form>

	<div class="card-elevated p-8">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="title-lg text-on-surface">Customer list</h2>
			<a class="btn-tertiary py-2 text-sm" href="?archived=1">View archived</a>
		</div>
		{#if data.customers.length === 0}
			<div data-testid="customers-empty-state" class="rounded-sm bg-surface-container-low p-12 text-center">
				<svg class="mx-auto h-12 w-12 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
				<p class="body-md mt-4 text-on-surface-variant">No customers yet. Add the first billing contact.</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each data.customers as customer}
					<div class="card" data-testid="customer-card-{customer.id}">
						<div class="flex flex-wrap items-start justify-between gap-4">
							<div>
								<p class="body-md font-medium text-on-surface">{customer.name}</p>
								<p class="body-sm mt-1 text-on-surface-variant">{customer.company || customer.email || 'No company provided'}</p>
							</div>
							<form method="POST" action="?/archive">
								<input type="hidden" name="id" value={customer.id} />
								<button class="btn-danger" type="submit">Archive</button>
							</form>
						</div>
						<form method="POST" action="?/update" class="mt-6 grid gap-4 md:grid-cols-2">
							<input type="hidden" name="id" value={customer.id} />
							<input class="input" name="name" placeholder="Customer name" value={customer.name} required />
							<input class="input" name="company" placeholder="Company" value={customer.company} />
							<input class="input" name="email" type="email" placeholder="Email" value={customer.email} />
							<input class="input" name="phone" placeholder="Phone" value={customer.phone} />
							<textarea class="input min-h-24 md:col-span-2" name="address" placeholder="Billing address">{customer.address}</textarea>
							<textarea class="input min-h-20 md:col-span-2" name="notes" placeholder="Notes">{customer.notes}</textarea>
							<button class="btn-secondary md:w-max" data-testid="customer-update-{customer.id}" type="submit">Update</button>
						</form>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
