<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';

	export let data;

	$: ({ products } = data);
</script>

<section>
	{#each products as product}
		<ProductCard {product} />
	{/each}
</section>
