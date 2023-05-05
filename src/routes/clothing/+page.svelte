<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';
	import { flip } from 'svelte/animate';

	export let data;

	const searchProducts: SearchableProduct[] = data.products.map((product: Product) => ({
		...product,
		searchTerms: `${product.name} ${product.description} ${product.size}`
	}));

	const searchStore = createSearchStore(searchProducts);

	const unsubscribe = searchStore.subscribe((value) => searchHandler(value));

	onDestroy(() => unsubscribe());
</script>

<section>
	<h1 class="!leading-loose">Clothing</h1>
	<input
		class="input max-w-lg mx-auto"
		type="search"
		name="search"
		placeholder="Search anything here..."
		bind:value={$searchStore.search}
	/>
	<hr class="mb-6 my-12" />
	<ul class="flex flex-wrap gap-2">
		{#each $searchStore.filtered as product (product.id)}
			<li class="flex-1" animate:flip={{ duration: 250 }}>
				<ProductCard {product} />
			</li>
		{/each}
	</ul>
</section>
