<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { drawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/layout/Navigation.svelte';
	import ShoppingCart from '$lib/components/layout/ShoppingCart.svelte';

	const toggleSideBar = () => {
		const drawerSettings: DrawerSettings = {
			id: 'sidebar',
			width: 'w-64',
			regionDrawer: 'p-4',
			position: 'left'
		};
		drawerStore.open(drawerSettings);
	};
</script>

<AppBar class="h-[var(--header-height)] sticky top-0" padding="py-4 px-[5vw] md:px-[12.5vw]" shadow="!shadow-lg">
	<svelte:fragment slot="lead">
		<span class="hidden lg:block"><Navigation orientation="horizontal" /></span>
		<button class="lg:hidden btn" aria-label="hamburger-menu" on:click={toggleSideBar}>
			<svg viewBox="0 0 100 100" class="fill-token w-8">
				<rect x="10" y="20" width="80" height="10" rx="2" />
				<rect x="10" y="45" width="80" height="10" rx="2" />
				<rect x="10" y="70" width="80" height="10" rx="2" />
			</svg>
		</button>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<ShoppingCart />
		<p class="!text-3xl">SBJCTV</p>
	</svelte:fragment>
</AppBar>
