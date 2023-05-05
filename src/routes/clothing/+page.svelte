<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';

	export let data;

	$: ({ products } = data);
</script>

<section>
	<ul class="flex flex-wrap gap-2">
		{#each products as product}
			<li class="flex-1">
				<ProductCard {product} />
			</li>
		{/each}
	</ul>
</section>
