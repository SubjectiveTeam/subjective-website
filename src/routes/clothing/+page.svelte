<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ products } = data);
</script>

<section>
	{#each products as product}
		<ProductCard {product} />
	{/each}
</section>
