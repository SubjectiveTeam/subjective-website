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
		{#each $searchStore.filtered as productGroupDetailed (productGroupDetailed.id)}
			<li class="flex-[1rem]" animate:flip={{ duration: 250 }}>
				<ProductCard {productGroupDetailed} />
			</li>
		{/each}
	</ul>
</section>
