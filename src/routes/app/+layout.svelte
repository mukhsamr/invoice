<script lang="ts">
	let { data, children } = $props();
	const navItems = [
		{ href: "/app", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
		{ href: "/app/customers", label: "Customers", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
		{ href: "/app/services", label: "Services", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
		{ href: "/app/invoices", label: "Invoices", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
		{ href: "/app/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }
	];
	const isActive = (href: string) => data.pathname === href || (href !== "/app" && data.pathname.startsWith(href));
</script>

<div class="min-h-screen bg-surface px-4 py-4 lg:px-6 lg:py-6">
	<div class="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
		<aside class="glass no-print flex flex-col gap-8 rounded p-6">
			<div class="space-y-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-sm bg-primary">
					<svg class="h-6 w-6 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				</div>
				<div>
					<p class="label-md text-primary">Invoice Studio</p>
					<h1 class="title-lg mt-2 text-on-surface">{data.profile.companyName}</h1>
				</div>
			</div>
			<nav class="flex-1 space-y-2">
				{#each navItems as item}
					<a href={item.href} class="group flex items-center gap-3 rounded-sm px-4 py-3 transition-all duration-200 {isActive(item.href) ? 'bg-primary text-on-primary shadow-ambient-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
						</svg>
						<span class="body-md font-medium">{item.label}</span>
					</a>
				{/each}
			</nav>
			<div class="space-y-4 rounded-sm bg-surface-container-low p-4">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-on-primary">
						<span class="label-md">{data.user.name.charAt(0).toUpperCase()}</span>
					</div>
					<div class="flex-1 overflow-hidden">
						<p class="body-md truncate font-medium text-on-surface">{data.user.name}</p>
						<p class="body-sm truncate text-on-surface-variant">{data.user.email}</p>
					</div>
				</div>
				<a href="/auth/sign-out" class="btn-tertiary w-full justify-center py-2 text-sm">Sign out</a>
			</div>
		</aside>
		<main class="space-y-6">{@render children()}</main>
	</div>
</div>
