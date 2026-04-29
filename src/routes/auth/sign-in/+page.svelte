<script lang="ts">let { form } = $props();</script>

<div class="min-h-screen bg-surface px-6 py-10">
	<div class="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
		<section class="relative space-y-10">
			<div class="absolute -left-16 top-0 h-72 w-72 rounded-sm bg-primary-fixed-dim/30 blur-3xl"></div>
			<div class="relative space-y-6">
				<p class="label-md inline-flex rounded-sm bg-primary px-4 py-2 text-on-primary">Invoice Studio</p>
				<h1 class="display-lg  text-on-surface">Generate beautiful invoices without messy spreadsheets.</h1>
				<p class="body-lg  text-on-surface-variant">Track customers, reusable services, invoice status, and PDF-ready documents in one focused workspace.</p>
			</div>
			<div class="relative space-y-6">
				<div class="flex items-start gap-4">
					<div class="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-on-primary">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<p class="title-md text-on-surface">Professional invoicing</p>
						<p class="body-md mt-1 text-on-surface-variant">Create polished, print-ready invoices in minutes.</p>
					</div>
				</div>
				<div class="flex items-start gap-4">
					<div class="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-on-primary">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<p class="title-md text-on-surface">Revenue tracking</p>
						<p class="body-md mt-1 text-on-surface-variant">Monitor paid and outstanding amounts at a glance.</p>
					</div>
				</div>
				<div class="flex items-start gap-4">
					<div class="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-on-primary">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</div>
					<div>
						<p class="title-md text-on-surface">Customer management</p>
						<p class="body-md mt-1 text-on-surface-variant">Organize clients and reusable service catalogs.</p>
					</div>
				</div>
			</div>
		</section>
		<form method="POST" data-testid="signin-form" class="card-elevated space-y-6 p-8 lg:translate-y-12">
			<div class="space-y-2">
				<p class="label-md text-primary">Welcome back</p>
				<h2 class="headline-md text-on-surface">Sign in</h2>
			</div>
			{#if form?.message}
				<p class="rounded-sm bg-error-container px-4 py-3 text-sm text-on-error-container">{form.message}</p>
			{/if}
			<input class="input" data-testid="signin-email" name="email" type="email" placeholder="Email" required />
			<input class="input" data-testid="signin-password" name="password" type="password" placeholder="Password" required />
			<button class="btn-primary w-full" data-testid="signin-submit" type="submit">Continue</button>
		</form>
	</div>
</div>