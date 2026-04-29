<script lang="ts">
	import { BriefcaseBusiness, FileText, House, Settings, Users } from 'lucide-svelte';

	let { data, children } = $props();
	const navItems = [
		{
			href: '/app',
			label: 'Overview',
			icon: House
		},
		{
			href: '/app/customers',
			label: 'Customers',
			icon: Users
		},
		{
			href: '/app/services',
			label: 'Services',
			icon: BriefcaseBusiness
		},
		{
			href: '/app/invoices',
			label: 'Invoices',
			icon: FileText
		},
		{
			href: '/app/settings',
			label: 'Settings',
			icon: Settings
		}
	];
	const isActive = (href: string) =>
		data.pathname === href || (href !== '/app' && data.pathname.startsWith(href));
</script>

<div class="flex h-screen w-screen overflow-hidden bg-surface">
	<aside class="no-print flex w-72 flex-col gap-8 bg-black p-6 border-r border-black">
		<div class="space-y-4">
			<div class="flex h-12 w-12 items-center justify-center rounded-none bg-primary border-2 border-white shadow-[4px_4px_0px_0px_#ffffff]">
				<FileText class="h-6 w-6 text-white" />
			</div>
			<div>
				<p class="label-md text-primary font-bold">Invoice Studio</p>
				<h1 class="title-lg mt-2 text-white">{data.profile.companyName}</h1>
			</div>
		</div>
		<nav class="flex-1 space-y-2">
			{#each navItems as item (item.href)}
				<a
					href={item.href}
					class="group flex items-center gap-3 rounded-none px-4 py-3 transition-all duration-100 relative {isActive(
						item.href
					)
						? 'text-primary bg-white border-2 border-primary shadow-[4px_4px_0px_0px_#065f46]'
						: 'text-zinc-400 hover:bg-zinc-900 hover:text-white border-2 border-transparent'}"
				>
					{#if isActive(item.href)}
						<div class="absolute -left-6 h-full w-2 bg-primary"></div>
					{/if}
					<item.icon class="h-5 w-5" />
					<span class="body-md font-black">{item.label}</span>
				</a>
			{/each}
		</nav>
		<div class="space-y-4 rounded-none bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_#065f46]">
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-none bg-black text-white border-2 border-black"
				>
					<span class="label-md font-black">{data.user.name.charAt(0).toUpperCase()}</span>
				</div>
				<div class="flex-1 overflow-hidden">
					<p class="body-md truncate font-black text-black">{data.user.name}</p>
					<p class="body-sm truncate text-zinc-600 font-bold">{data.user.email}</p>
				</div>
			</div>
			<a href="/auth/sign-out" class="btn-danger w-full justify-center py-2 text-sm border-2 border-red-600">Sign out</a>
		</div>
	</aside>
	<main class="flex-1 overflow-y-auto p-8 space-y-6 bg-white">{@render children()}</main>
</div>
