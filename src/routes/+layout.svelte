<script lang="ts">
	// Note: Import order for stylesheets is important (theme -> all -> app)
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { Toast, Modal, Drawer, AppShell } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import CookieConsentBanner from './CookieConsentBanner.svelte';
	import DrawerContentManager from '$lib/components/DrawerContentManager.svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { cartStore } from '$lib/stores/cart';

	export let data: LayoutData;

	$: ({ supabase, session, consentCookiePresent } = data);

	onMount(() => {
		cartStore.init();
		cartStore.add({id: 2, name: 'Tesla', price: 5000, tags: []});
		cartStore.add({id: 3, name: 'Mustang', price: 5000, tags: []});
		cartStore.add({id: 4, name: 'Volvo', price: 5000, tags: []});
		cartStore.add({id: 5, name: 'Toyota', price: 5000, tags: []});
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!-- Overlays -->
<Toast />
<Modal />
<Drawer>
	<DrawerContentManager/>
</Drawer>
{#if !consentCookiePresent}
	<CookieConsentBanner />
{/if}

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header"><Header /></svelte:fragment>
	<div class="p-4">
		<slot />
	</div>
	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
</AppShell>
