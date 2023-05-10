<script lang="ts">
	import { page } from '$app/stores';
	let breadCrumbs: string[] = [];
	$: if ($page.url.pathname) {
		// We do a substring here to remove the empty string from the start
		breadCrumbs = $page.url.pathname.substring(1).split('/');
	}

	const lastCrumb = (crumb: string): boolean => {
		return breadCrumbs.indexOf(crumb) === breadCrumbs.length - 1;
	};

	const getCrumbHref = (crumb: string): string => {
		let href: string = '';
		for (const currentCrumb of breadCrumbs) {
			href += '/' + currentCrumb;
			if (currentCrumb === crumb) break;
		}
		return href;
	};
</script>

<ol class="breadcrumb w-full capitalize h-8">
	{#if breadCrumbs.length > 1}
		{#each breadCrumbs as crumb, i}
			{#if !lastCrumb(crumb)}
				<li class="crumb"><a href={getCrumbHref(crumb)}>{crumb}</a></li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
			{:else}
				<li>{crumb}</li>
			{/if}
		{/each}
	{/if}
</ol>
