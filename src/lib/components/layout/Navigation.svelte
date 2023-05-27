<script lang="ts">
	import { page } from '$app/stores';
	import { drawerStore } from '@skeletonlabs/skeleton';

	export let orientation: string;

	type NavigationItem = {
		name: string;
		href: string;
	};

	const navItems: NavigationItem[] = [
		{
			name: 'Clothing',
			href: '/clothing'
		},
		{
			name: 'About',
			href: '/about'
		}
	];
</script>

<nav class="list-nav flex {orientation === 'horizontal' ? 'flex-row' : 'flex-col'} gap-1">
	<a class="font-semibold" class:active-link={$page.url.pathname === '/'} on:click={() => drawerStore.close()} href="/"
		>Home</a
	>
	{#each navItems as { name, href }}
		<a class="font-semibold" class:active-link={$page.url.pathname.startsWith(href)} on:click={() => drawerStore.close()} {href}
			>{name}</a
		>
	{/each}
	{#if !$page.data.session}
		<a
			class="font-semibold"
			class:active-link={$page.url.pathname.startsWith('/sign-in')}
			on:click={() => drawerStore.close()}
			href="/sign-in">Sign In</a
		>
		<a
			class="font-semibold"
			class:active-link={$page.url.pathname.startsWith('/sign-up')}
			on:click={() => drawerStore.close()}
			href="/sign-up">Sign Up</a
		>
	{:else}
		{#if $page.data.session?.user.app_metadata.claims_admin}
			<a
				class="font-semibold"
				class:active-link={$page.url.pathname.startsWith('/dashboard')}
				on:click={() => drawerStore.close()}
				href="/dashboard">Dashboard</a
			>
		{/if}
		<a
			class="font-semibold"
			class:active-link={$page.url.pathname.startsWith('/account')}
			on:click={() => drawerStore.close()}
			href="/account">Account</a
		>
	{/if}
</nav>
