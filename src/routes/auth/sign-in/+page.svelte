<script lang="ts">let { form } = $props();</script>
<div class="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
	<div class="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
		<section class="space-y-6">
			<p class="inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-600">Invoice Studio</p>
			<h1 class="text-5xl font-semibold tracking-tight text-slate-900">Generate beautiful invoices without messy spreadsheets.</h1>
			<p class="max-w-2xl text-lg text-slate-600">Track customers, reusable services, invoice status, and PDF-ready documents in one focused workspace.</p>
		</section>
		<form method="POST" data-testid="signin-form" class="card space-y-5 p-8">
			<h2 class="text-2xl font-semibold text-slate-900">Sign in</h2>
			{#if form?.message}
				<p class="text-sm text-rose-600">{form.message}</p>
			{/if}
			<input class="input" data-testid="signin-email" name="email" type="email" placeholder="Email" required />
			<input class="input" data-testid="signin-password" name="password" type="password" placeholder="Password" required />
			<button class="btn-primary w-full" data-testid="signin-submit" type="submit">Continue</button>
		</form>
	</div>
</div>