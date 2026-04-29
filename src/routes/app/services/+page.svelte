<script lang="ts">import { formatCurrency } from "$lib/utils/format"; let { data, form } = $props();</script>

<section class="card-elevated no-print p-8">
	<p class="label-md text-primary">Services</p>
	<h1 class="headline-lg mt-2 text-on-surface">Create reusable service items</h1>
</section>

<section class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
	<form method="POST" action="?/create" data-testid="service-create-form" class="card-elevated space-y-5 p-8">
		<div>
			<h2 class="title-lg text-on-surface">New service</h2>
			<p class="body-md mt-2 text-on-surface-variant">Add a reusable service to your catalog.</p>
		</div>
		{#if form?.message}
			<p class="rounded-sm bg-error-container px-4 py-3 text-sm text-on-error-container">{form.message}</p>
		{/if}
		<input class="input" data-testid="service-name" name="name" placeholder="Service name" required />
		<textarea class="input min-h-28" data-testid="service-description" name="description" placeholder="Description"></textarea>
		<input class="input" data-testid="service-price" name="unitPrice" type="number" min="0" step="0.01" placeholder="Unit price" />
		<button class="btn-primary w-full" data-testid="service-save" type="submit">Save service</button>
	</form>

	<div class="card-elevated p-8">
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h2 class="title-lg text-on-surface">Service catalog</h2>
				<p class="body-sm mt-1 text-on-surface-variant">Use these as invoice shortcuts.</p>
			</div>
		</div>
		{#if data.services.length === 0}
			<div data-testid="services-empty-state" class="rounded-sm bg-surface-container-low p-12 text-center">
				<svg class="mx-auto h-12 w-12 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
				</svg>
				<p class="body-md mt-4 text-on-surface-variant">No services yet. Add your first offering.</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each data.services as service}
					<div class="card" data-testid="service-card-{service.id}">
						<div class="flex items-center justify-between gap-4">
							<div>
								<p class="body-md font-medium text-on-surface">{service.name}</p>
								<p class="body-sm mt-1 text-on-surface-variant">{formatCurrency(service.unitPrice)}</p>
							</div>
							<form method="POST" action="?/delete">
								<input type="hidden" name="id" value={service.id} />
								<button class="btn-danger" type="submit">Delete</button>
							</form>
						</div>
						<form method="POST" action="?/update" class="mt-6 grid gap-4">
							<input type="hidden" name="id" value={service.id} />
							<input class="input" name="name" placeholder="Service name" value={service.name} required />
							<textarea class="input min-h-24" name="description" placeholder="Description">{service.description}</textarea>
							<input class="input" name="unitPrice" type="number" min="0" step="0.01" placeholder="Unit price" value={service.unitPrice} />
							<button class="btn-secondary w-max" data-testid="service-update-{service.id}" type="submit">Update</button>
						</form>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
