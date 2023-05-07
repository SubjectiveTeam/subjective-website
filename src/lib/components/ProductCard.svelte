<script lang="ts">
	import { cartStore } from '$lib/stores/cart';

	function getProductGroup(productGroupDetailed: ProductGroupDetailed): ProductGroup {
		return {
			name: productGroupDetailed.name,
			description: productGroupDetailed.description,
			images: productGroupDetailed.images
		} as ProductGroup;
	}

	export let productGroupDetailed: ProductGroupDetailed;
</script>

<div class="card">
	<header class="card-header">
		<p class="font-bold !text-xl">{productGroupDetailed.name}</p>
		<p class="!text-sm">{productGroupDetailed.description}</p>
	</header>
	<section class="p-4 relative">
		{#if productGroupDetailed.images}
			<img
				class="rounded-token"
				src={productGroupDetailed?.images[0]}
				alt={productGroupDetailed.name}
				loading="lazy"
			/>
		{/if}
		<ul class="flex absolute top-[calc(1rem+1vw)] right-[calc(1rem+1vw)] gap-2">
			{#each productGroupDetailed.products as product}
				<li class="chip variant-filled-primary">{product.size}</li>
			{/each}
		</ul>
	</section>
	<footer class="card-footer flex justify-between">
		<p class="chip variant-filled py-1">€{productGroupDetailed.products[0].price}</p>
		<button
			class="btn btn-sm variant-ghost-success"
			on:click={() =>
				cartStore.add({
					product: productGroupDetailed.products[0],
					productGroup: getProductGroup(productGroupDetailed),
					quantity: 1
				})}>Add To Cart</button>
	</footer>
</div>