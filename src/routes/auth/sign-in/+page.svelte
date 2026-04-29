<script lang="ts">
	import { CircleDollarSign } from 'lucide-svelte';

	let { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center px-6 py-12">
	<div class="w-full lg:w-1/3 md:w-1/2 space-y-8">
		<!-- Branding -->
		<div class="text-center space-y-4">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-none bg-primary text-white border-4 border-black shadow-[6px_6px_0px_0px_#000]">
				<CircleDollarSign class="h-8 w-8" />
			</div>
			<div class="space-y-1">
				<h1 class="headline-md text-black font-black">Invoice Studio</h1>
				<p class="body-md text-zinc-600 font-bold uppercase tracking-widest">Sign in to your account</p>
			</div>
		</div>

		<!-- Login Form -->
		<form method="POST" data-testid="signin-form" class="card-elevated space-y-8 p-10">
			{#if form?.message}
				<div class="rounded-none border-4 border-red-600 bg-white px-4 py-3 text-sm text-red-600 font-black uppercase">
					{form.message}
				</div>
			{/if}

			<div class="space-y-6">
				<div class="space-y-2">
					<label for="email" class="label-md text-black font-black uppercase tracking-widest">Email Address</label>
					<input id="email" class="input border-4 border-black font-black uppercase" data-testid="signin-email" name="email" type="email" placeholder="ADMIN@EXAMPLE.COM" required />
				</div>
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<label for="password" class="label-md text-black font-black uppercase tracking-widest">Password</label>
					</div>
					<input id="password" class="input border-4 border-black font-black uppercase" data-testid="signin-password" name="password" type="password" placeholder="••••••••" required />
				</div>
			</div>

			<button class="btn-primary w-full mt-4 font-black uppercase py-4 text-lg" data-testid="signin-submit" type="submit">Sign in</button>
		</form>
		
		<div class="text-center">
			<p class="body-sm text-on-surface-variant">
				Secure workspace for your business
			</p>
		</div>
	</div>
</div>
