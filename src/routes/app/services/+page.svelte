<script lang="ts">
	import { BriefcaseBusiness } from 'lucide-svelte';
	import { formatCurrency } from "$lib/utils/format";

	let { data, form } = $props();
</script>

<section class="card-elevated no-print p-8">
	<p class="label-md text-primary font-black uppercase tracking-widest">Services</p>
	<h1 class="headline-lg mt-2 text-black font-black">Create reusable service items</h1>
</section>

<section class="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
	<form method="POST" action="?/create" data-testid="service-create-form" class="card-elevated space-y-6 p-8">
		<div>
			<h2 class="title-lg text-black font-black uppercase tracking-tight">New service</h2>
			<p class="body-md mt-2 text-zinc-600 font-bold uppercase">Add a reusable service to your catalog.</p>
		</div>
		{#if form?.message}
			<p class="rounded-none border-4 border-red-600 bg-white px-4 py-3 text-sm text-red-600 font-black uppercase">{form.message}</p>
		{/if}
		<input class="input border-4 border-black font-black uppercase" data-testid="service-name" name="name" placeholder="Service name" required />
		<textarea class="input min-h-28 border-4 border-black font-black uppercase" data-testid="service-description" name="description" placeholder="Description"></textarea>
		<input class="input border-4 border-black font-black uppercase" data-testid="service-price" name="unitPrice" type="number" min="0" step="0.01" placeholder="Unit price" />
		<button class="btn-primary w-full font-black uppercase py-4" data-testid="service-save" type="submit">Save service</button>
	</form>

	<div class="card-elevated p-8">
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h2 class="title-lg text-black font-black uppercase tracking-tight">Service catalog</h2>
				<p class="body-sm mt-1 text-zinc-600 font-bold uppercase">Use these as invoice shortcuts.</p>
			</div>
		</div>
		{#if data.services.length === 0}
			<div data-testid="services-empty-state" class="rounded-none border-4 border-dashed border-zinc-200 p-12 text-center bg-white">
				<BriefcaseBusiness class="mx-auto h-16 w-16 text-zinc-200" />
				<p class="body-md mt-6 text-zinc-400 font-black uppercase">No services yet.</p>
			</div>
		{:else}
			<div class="space-y-6">
				{#each data.services as service}
					<div class="card" data-testid="service-card-{service.id}">
						<div class="flex items-center justify-between gap-4">
							<div>
								<p class="title-md font-black text-black uppercase">{service.name}</p>
								<p class="body-md mt-1 text-zinc-600 font-black">{formatCurrency(service.unitPrice)}</p>
							</div>
							<form method="POST" action="?/delete">
								<input type="hidden" name="id" value={service.id} />
								<button class="btn-danger py-2 px-4 text-xs font-black uppercase" type="submit">Del</button>
							</form>
						</div>
						<form method="POST" action="?/update" class="mt-6 grid gap-4">
							<input type="hidden" name="id" value={service.id} />
							<input class="input border-2 border-black font-bold" name="name" placeholder="Service name" value={service.name} required />
							<textarea class="input min-h-24 border-2 border-black font-bold" name="description" placeholder="Description">{service.description}</textarea>
							<input class="input border-2 border-black font-bold" name="unitPrice" type="number" min="0" step="0.01" placeholder="Unit price" value={service.unitPrice} />
							<button class="btn-secondary w-max px-6 font-black uppercase" data-testid="service-update-{service.id}" type="submit">Update</button>
						</form>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
