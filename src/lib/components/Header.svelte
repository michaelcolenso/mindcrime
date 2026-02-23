<script lang="ts">
	import { PUBLIC_PROJECT_NAME } from '$env/static/public';
	import Container from './Container.svelte';
	import { LogOut, Menu, FileText, LayoutDashboard } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	const publicLinks = [
		{ name: 'Features', href: '/#features' },
		{ name: 'Pricing', href: '/#pricing' },
		{ name: 'FAQ', href: '/#faq' }
	];
</script>

<Container>
	<header class="navbar px-0">
		<div class="navbar-start">
			<a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
				<FileText class="w-8 h-8 text-primary" />
				<div class="text-2xl sm:text-2xl font-bold">{PUBLIC_PROJECT_NAME}</div>
			</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				{#each publicLinks as link}
					<li>
						<a href={link.href}>{link.name}</a>
					</li>
				{/each}
			</ul>
		</div>
		<div class="navbar-end hidden lg:flex gap-2">
			{#if $page.data.user}
				<a href="/dashboard" class="btn btn-ghost gap-2">
					<LayoutDashboard size={16} />
					Dashboard
				</a>
				<form method="post" action="/login?/signout" use:enhance>
					<button type="submit" class="btn btn-ghost gap-2 text-error">
						<LogOut size={16} />
						Log out
					</button>
				</form>
			{:else}
				<a href="/login" class="btn btn-ghost">Log in</a>
				<a href="/login" class="btn btn-primary">Get started free</a>
			{/if}
		</div>
		<div class="navbar-end lg:hidden">
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-ghost m-1"><Menu /></div>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul
					tabindex="0"
					class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
				>
					{#each publicLinks as link}
						<li><a href={link.href}>{link.name}</a></li>
					{/each}
					<div class="divider my-1"></div>
					{#if $page.data.user}
						<li><a href="/dashboard">Dashboard</a></li>
						<li>
							<form method="post" action="/login?/signout" use:enhance>
								<button type="submit" class="text-error w-full text-left">Log out</button>
							</form>
						</li>
					{:else}
						<li><a href="/login">Log in</a></li>
						<li><a href="/login" class="font-semibold text-primary">Get started free</a></li>
					{/if}
				</ul>
			</div>
		</div>
	</header>
</Container>
