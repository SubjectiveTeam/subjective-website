<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { Toast, Modal, Drawer } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import ProgressBar from '$lib/components/layout/ProgressBar.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Main from '$lib/components/layout/Main.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import CookieConsentBanner from '$lib/components/layout/CookieConsentBanner.svelte';
	import DrawerContentManager from '$lib/components/layout/DrawerContentManager.svelte';
	import { afterNavigate, beforeNavigate, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { cartStore } from '$lib/stores/cart';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { progress } from '$lib/stores/progress';
	import { triggerToastFromRedirect } from '$lib/util/util';

	export let data;

	$: ({ supabase, session, consentCookiePresent } = data);

	onMount(() => {
		// Initialize cartStore
		cartStore.init();

		// Setup invalidator when the auth state of a user changes
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	// Inject Vercel Analytics
	inject({ mode: dev ? 'development' : 'production' });

	// Initialize popup
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	beforeNavigate(() => progress.start());

	afterNavigate(() => {
		triggerToastFromRedirect($page.url);
		progress.complete();
	});

	// Function that can retrieve the tile from a route for eg '/my-location/specific-action' converts to 'Subjective - Specific Location'
	function getTitle(location: string) {
		let title = 'Subjective';

		if (location === '/') location = 'Home';
		else {
			const locationSplit = location.split('/');

			const lastLocation = locationSplit[1];

			const lastLocationSpaced = lastLocation.replace('-', ' ');

			location = lastLocationSpaced.replace(/\w\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		}
		return title + ' - ' + location;
	}
</script>

<svelte:head>
	<!-- SEO -->
	<meta name="title" content="Subjective" />
	<meta
		name="description"
		content="Subjective is an up and coming brand to change the fashion industry. With Subjective you can be and express yourself."
	/>
	<meta name="keywords" content="Subjective, Clothing, Branding" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="English" />

	<!-- TITLE -->
	{#key $page.url.pathname}<title>{getTitle($page.url.pathname || '')}</title>{/key}
</svelte:head>

<!-- Overlays -->
<Toast />
<Modal />
<Drawer>
	<DrawerContentManager />
</Drawer>
{#if !consentCookiePresent}
	<CookieConsentBanner />
{/if}
<ProgressBar bind:this={$progress} />

<!-- Layout -->
<Header />
<Main><slot /></Main>
<Footer />
