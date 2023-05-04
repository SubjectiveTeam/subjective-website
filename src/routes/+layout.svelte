<script lang="ts">
	// Note: Import order for stylesheets is important (theme -> all -> app)
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { Toast, Modal, Drawer, AppShell, toastStore } from '@skeletonlabs/skeleton';
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

	// System to display messages from anywhere in the app after a redirect, it's more user friendly to let someone know why they were redirected.
	const messageTypeBackgroundsMap = new Map<string, string>();
	messageTypeBackgroundsMap.set('info', 'variant-filled-secondary');
	messageTypeBackgroundsMap.set('success', 'variant-filled-success');
	messageTypeBackgroundsMap.set('warning', 'variant-filled-warning');
	messageTypeBackgroundsMap.set('error', 'variant-filled-error');
	afterNavigate(() => {
		const message = $page.url.searchParams.get('message');
		const background = messageTypeBackgroundsMap.get(
			$page.url.searchParams.get('message_type') || ''
		);
		if (message && background) toastStore.trigger({ message, background });
	});

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css"
	/>
	<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
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

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header"><Header /></svelte:fragment>
	<div
		class={$page.route.id === '/'
			? 'h-[100vh] xl:bg-[url("/homepage-bg.svg")] bg-cover bg-center'
			: ''}
	>
		<div class="py-4 px-[5vw] md:px-[15vw]">
			<slot />
		</div>
	</div>

	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
</AppShell>
