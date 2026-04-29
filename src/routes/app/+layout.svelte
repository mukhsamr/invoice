<script lang="ts">
	let { data, children } = $props();
	const navItems = [
		{ href: '/app', label: 'Overview' },
		{ href: '/app/customers', label: 'Customers' },
		{ href: '/app/services', label: 'Services' },
		{ href: '/app/invoices', label: 'Invoices' },
		{ href: '/app/settings', label: 'Settings' }
	];
	const isActive = (href: string) => data.pathname === href || (href !== '/app' && data.pathname.startsWith(href));
</script>
<div class="min-h-screen px-4 py-4 lg:px-6 lg:py-6"><div class="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[260px_minmax(0,1fr)]"><aside class="card no-print flex flex-col gap-6 p-5"><div><p class="text-sm font-medium uppercase tracking-[0.2em] text-brand-600">Invoice Studio</p><h1 class="mt-3 text-2xl font-semibold text-slate-900">{data.profile.companyName}</h1><p class="mt-2 text-sm text-slate-500">Solo billing workspace on SvelteKit + Cloudflare.</p></div><nav class="space-y-2">{#each navItems as item}<a href={item.href} class={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive(item.href) ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>{item.label}</a>{/each}</nav><div class="mt-auto rounded-3xl bg-slate-50 p-4 text-sm text-slate-600"><p class="font-medium text-slate-900">{data.user.name}</p><p class="mt-1">{data.user.email}</p><a href="/auth/sign-out" class="mt-4 inline-flex text-brand-600 hover:text-brand-700">Sign out</a></div></aside><main class="space-y-6">{@render children()}</main></div></div>
