<script>
	import { page } from '$app/stores';
</script>

<div
	class="
		py-[7.5vh] px-[5vw] md:px-[12.5vw] min-h-[calc(100vh-var(--header-height))]
		{$page.url.pathname === '/' ? 'xl:bg-[url("/homepage-bg.svg")] bg-cover bg-center' : ''}
		">
	<slot />
</div>
