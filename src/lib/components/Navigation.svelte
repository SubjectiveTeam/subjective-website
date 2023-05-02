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

<nav class="list-nav flex {orientation === 'horizontal' ? 'flex-row' : 'flex-col'}">
	<a on:click={() => drawerStore.close()} href='/'><img class="w-8 aspect-square" src="SBJCTV-Logo.png" alt="SBJCTV-logo.png" /></a>
	{#each navItems as { name, href }}
		<a on:click={() => drawerStore.close()} {href}>{name}</a>
	{/each}
	{#if !$page.data.session}
		<a on:click={() => drawerStore.close()} href="/sign-in">Sign In</a>
		<a on:click={() => drawerStore.close()} href="/sign-up">Sign Up</a>
	{:else}
		{#if $page.data.session?.user.app_metadata.claims_admin}
			<a on:click={() => drawerStore.close()} href="/dashboard">Dashboard</a>
		{/if}
		<a on:click={() => drawerStore.close()} href="/account">Account</a>
	{/if}
</nav>
