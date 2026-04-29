<script lang="ts">let { form } = $props();</script>
<div class="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
	<div class="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
		<section class="space-y-6">
			<p class="inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-600">First-time setup</p>
			<h1 class="text-5xl font-semibold tracking-tight text-slate-900">Launch your invoice workspace in minutes.</h1>
			<p class="max-w-2xl text-lg text-slate-600">Create the owner account, then manage customers, services, invoices, and polished PDF-ready billing from one clean workspace.</p>
		</section>
		<form method="POST" data-testid="setup-form" class="card space-y-5 p-8">
			{#if form?.message}
				<p class="text-sm text-rose-600">{form.message}</p>
			{/if}
			<input class="input" data-testid="setup-name" name="name" placeholder="Full name" required />
			<input class="input" data-testid="setup-email" name="email" type="email" placeholder="owner@company.com" required />
			<input class="input" data-testid="setup-password" name="password" type="password" placeholder="Password" required />
			<button class="btn-primary w-full" data-testid="setup-submit" type="submit">Create workspace</button>
		</form>
	</div>
</div>