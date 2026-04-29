<script lang="ts">
	import { CircleDollarSign } from 'lucide-svelte';

	let { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center px-6 py-12">
	<div class="w-full lg:w-1/3 md:w-1/2 space-y-8">
		<!-- Branding -->
		<div class="text-center space-y-4">
			<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-sm bg-primary text-on-primary">
				<CircleDollarSign class="h-7 w-7" />
			</div>
			<div class="space-y-1">
				<h1 class="headline-md text-on-surface">Invoice Studio</h1>
				<p class="body-md text-on-surface-variant">Create your owner account</p>
			</div>
		</div>

		<!-- Setup Form -->
		<form method="POST" data-testid="setup-form" class="card-elevated space-y-6 p-8">
			{#if form?.message}
				<div class="rounded-sm bg-error-container px-4 py-3 text-sm text-on-error-container">
					{form.message}
				</div>
			{/if}

			<div class="space-y-4">
				<div class="space-y-1.5">
					<label for="name" class="label-sm text-on-surface-variant">Full name</label>
					<input id="name" class="input" data-testid="setup-name" name="name" placeholder="John Doe" required />
				</div>
				<div class="space-y-1.5">
					<label for="email" class="label-sm text-on-surface-variant">Email address</label>
					<input id="email" class="input" data-testid="setup-email" name="email" type="email" placeholder="owner@company.com" required />
				</div>
				<div class="space-y-1.5">
					<label for="password" class="label-sm text-on-surface-variant">Password</label>
					<input id="password" class="input" data-testid="setup-password" name="password" type="password" placeholder="••••••••" required />
				</div>
			</div>

			<button class="btn-primary w-full mt-2" data-testid="setup-submit" type="submit">Create workspace</button>
		</form>
		
		<div class="text-center">
			<p class="body-sm text-on-surface-variant">
				First-time initial setup
			</p>
		</div>
	</div>
</div>
