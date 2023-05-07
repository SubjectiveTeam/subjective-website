<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';
	import { flip } from 'svelte/animate';

	export let data;

	const searchProducts: SearchableProduct[] = data.products.map(
		(productGroupDetailed: ProductGroupDetailed) => {
			return {
				...productGroupDetailed,
				searchTerms: `${productGroupDetailed.name} ${productGroupDetailed.description}`
			};
		}
	);

	const searchStore = createSearchStore(searchProducts, data.search);

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
	<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
		{#each $searchStore.filtered as productGroupDetailed (productGroupDetailed.id)}
			<li class="" animate:flip={{ duration: 250 }}>
				<ProductCard {productGroupDetailed} />
			</li>
		{/each}
	</ul>
</section>
