<script>
	import { page } from '$app/stores';
	import BreadCrumbs from './BreadCrumbs.svelte';
</script>

<div
	class="
		pt-[calc(2.5vh+var(--header-height))] pb-[7.5vh] px-[5vw] md:px-[12.5vw] min-h-screen
		{$page.url.pathname === '/' ? 'xl:bg-[url("/homepage-bg.svg")] bg-cover bg-center' : ''}
		">
	<BreadCrumbs />
	<slot />
</div>
