<script lang="ts">
	// Note: Import order for stylesheets is important (theme -> all -> app)
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { Toast, Modal, Drawer, AppShell } from '@skeletonlabs/skeleton';
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';
	import Footer from './Footer.svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

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
<Drawer />

{#if !hasConsentedToCookies}
	<!-- COOKIE BANNER -->
{/if}

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="sidebarRight"><Sidebar /></svelte:fragment>
	<svelte:fragment slot="header"><Header /></svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
</AppShell>
