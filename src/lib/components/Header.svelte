<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { drawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import Navigation from './Navigation.svelte';
	import ShoppingCart from './ShoppingCart.svelte';

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

<AppBar padding="py-4 px-8" class="h-[var(--header-height)]">
	<svelte:fragment slot="lead">
		<span class="hidden lg:block"><Navigation orientation="horizontal" /></span>
		<button class="lg:hidden btn" on:click={toggleSideBar}>
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
