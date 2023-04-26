<script lang="ts">
	// Note: Import order for stylesheets is important (theme -> all -> app)
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { Toast, Modal, Drawer, AppShell } from '@skeletonlabs/skeleton';
	import Header from './Header.svelte';
	import Navigation from './Navigation.svelte';
	import Footer from './Footer.svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import DrawerContentManager from '$lib/components/DrawerContentManager.svelte';

	export let data: LayoutData;

	$: ({ supabase, session, hasConsentedToCookies } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<!-- Overlays -->
<Toast />
<Modal />
<Drawer><DrawerContentManager/></Drawer>

{#if !hasConsentedToCookies}
	<!-- COOKIE BANNER -->
{/if}

<!-- App Shell -->
<AppShell slotSidebarLeft="hidden lg:block w-64 p-4">
	<svelte:fragment slot="sidebarLeft"><Navigation /></svelte:fragment>
	<svelte:fragment slot="header"><Header /></svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
</AppShell>
