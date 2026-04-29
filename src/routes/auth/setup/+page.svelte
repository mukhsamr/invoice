<script lang="ts">let { form } = $props();</script>

<div class="min-h-screen bg-surface px-6 py-10">
	<div class="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
		<section class="relative space-y-10">
			<div class="absolute -left-16 top-0 h-72 w-72 rounded-sm bg-secondary-container/40 blur-3xl"></div>
			<div class="relative space-y-6">
				<p class="label-md inline-flex rounded-sm bg-primary px-4 py-2 text-on-primary">First-time setup</p>
				<h1 class="display-lg  text-on-surface">Launch your invoice workspace with editorial precision.</h1>
				<p class="body-lg  text-on-surface-variant">Create the owner account, then manage customers, services, invoices, and PDF-ready billing from one refined digital workspace.</p>
			</div>
			<div class="relative grid  gap-4 sm:grid-cols-3">
				<div class="card-highlight">
					<p class="label-sm text-primary">01</p>
					<p class="title-md mt-3 text-on-surface">Setup</p>
					<p class="body-md mt-2 text-on-surface-variant">Create secure ownership.</p>
				</div>
				<div class="card">
					<p class="label-sm text-primary">02</p>
					<p class="title-md mt-3 text-on-surface">Invoice</p>
					<p class="body-md mt-2 text-on-surface-variant">Build polished documents.</p>
				</div>
				<div class="card">
					<p class="label-sm text-primary">03</p>
					<p class="title-md mt-3 text-on-surface">Track</p>
					<p class="body-md mt-2 text-on-surface-variant">Monitor outstanding revenue.</p>
				</div>
			</div>
		</section>
		<form method="POST" data-testid="setup-form" class="card-elevated space-y-6 p-8 lg:translate-y-12">
			<div class="space-y-2">
				<p class="label-md text-primary">Owner access</p>
				<h2 class="headline-md text-on-surface">Create workspace</h2>
			</div>
			{#if form?.message}
				<p class="rounded-sm bg-error-container px-4 py-3 text-sm text-on-error-container">{form.message}</p>
			{/if}
			<input class="input" data-testid="setup-name" name="name" placeholder="Full name" required />
			<input class="input" data-testid="setup-email" name="email" type="email" placeholder="owner@company.com" required />
			<input class="input" data-testid="setup-password" name="password" type="password" placeholder="Password" required />
			<button class="btn-primary w-full" data-testid="setup-submit" type="submit">Create workspace</button>
		</form>
	</div>
</div>