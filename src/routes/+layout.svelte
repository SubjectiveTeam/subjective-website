<script lang="ts">
	// Note: Import order for stylesheets is important (theme -> all -> app)
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { Toast, Modal, Drawer, toastStore } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import CookieConsentBanner from '$lib/components/layout/CookieConsentBanner.svelte';
	import DrawerContentManager from '$lib/components/layout/DrawerContentManager.svelte';
	import { afterNavigate, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { cartStore } from '$lib/stores/cart';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import Main from '$lib/components/layout/Main.svelte';

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

	// Message Types
	const messageTypeBackgroundsMap = new Map<string, string>();
	messageTypeBackgroundsMap.set('info', 'variant-filled-secondary');
	messageTypeBackgroundsMap.set('success', 'variant-filled-success');
	messageTypeBackgroundsMap.set('warning', 'variant-filled-warning');
	messageTypeBackgroundsMap.set('error', 'variant-filled-error');

	afterNavigate(() => {
		// System to display messages from anywhere in the app after a redirect, it's more user friendly to let someone know why they were redirected.
		const message = $page.url.searchParams.get('message');
		const background = messageTypeBackgroundsMap.get(
			$page.url.searchParams.get('message_type') || ''
		);
		if (!message || !background) return;
		toastStore.trigger({ message, background });
		const url = new URL($page.url);
		const searchParams = new URLSearchParams(url.search);
		searchParams.delete('message');
		searchParams.delete('message_type');
		url.search = searchParams.toString();
		window.history.replaceState(null, '', url.href);
	});

	// Function that can retrieve the tile from a route for eg '/my-location/specific-action' converts to 'Subjective - Specific Location'
	function getTitle(location: string) {
		let title: string = 'Subjective';

		if (location === '/') location = 'Home';
		else {
			const locationSplit = location.split('/');

			const lastLocation = locationSplit[locationSplit.length - 1];

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

	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<!-- LIBS -->
	<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>

	<!-- TITLE -->
	{#key $page.route.id}<title>{getTitle($page.route.id || '')}</title>{/key}
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

<!-- Layout -->
<Header />
<Main><slot /></Main>
<Footer />
