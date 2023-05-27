<script>
	import { page } from '$app/stores';
	import BreadCrumbs from './BreadCrumbs.svelte';
</script>

<main
	class="
		pt-[calc(5vh+var(--header-height))] pb-[5vh] px-[5vw] md:px-[12.5vw] min-h-[calc(100vh)] mx-auto
		{$page.url.pathname === '/' ? 'xl:bg-[url("/homepage-bg.svg")] bg-cover bg-center' : ''}
		"
>
	<BreadCrumbs />
	<slot />
</main>
