<script lang="ts">
	// Note: Import order for stylesheets is important (theme -> all -> app)
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { Toast, Modal, Drawer, AppShell } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieConsentBanner from '$lib/components/CookieConsentBanner.svelte';
	import DrawerContentManager from '$lib/components/DrawerContentManager.svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { cartStore } from '$lib/stores/cart';

	export let data;

	$: ({ supabase, session, consentCookiePresent } = data);

	onMount(() => {
		cartStore.init();

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
	<DrawerContentManager />
</Drawer>
{#if !consentCookiePresent}
	<CookieConsentBanner />
{/if}

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header"><Header /></svelte:fragment>
	<div class="py-4 px-[5vw] md:px-[15vw]">
		<slot />
	</div>
	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
</AppShell>
