<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { drawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/layout/Navigation.svelte';
	import ShoppingCart from '$lib/components/layout/ShoppingCart.svelte';
	import { faBars, faHamburger, faSquareMinus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

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

<AppBar
	class="h-[var(--header-height)] fixed w-full top-0 z-[10]"
	padding="py-4 px-[5vw] md:px-[12.5vw]"
	gridColumns="grid-cols-3"
	shadow="!shadow-lg"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
>
	<svelte:fragment slot="lead">
		<span class="hidden lg:block"><Navigation orientation="horizontal" /></span>
		<button class="lg:hidden btn" aria-label="hamburger-menu" on:click={toggleSideBar}>
			<Fa size="2x" icon={faBars} />
		</button>
	</svelte:fragment>
	<p class="font-semibold text-lg md:hidden">Subjective</p>
	<svelte:fragment slot="trail">
		<ShoppingCart />
		<p class="hidden md:block !text-3xl">SBJCTV</p>
	</svelte:fragment>
</AppBar>
