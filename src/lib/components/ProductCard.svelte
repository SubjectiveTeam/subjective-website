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

<div class="card p-4 flex flex-col gap-4">
	<p class="font-bold !text-xl">{productGroupDetailed.name}</p>
	<p class="!text-sm">{productGroupDetailed.description}</p>
	{#if productGroupDetailed.images}
		<img
			class="rounded-token"
			src={productGroupDetailed?.images[0]}
			alt={productGroupDetailed.name}
			loading="lazy"
		/>
	{/if}
	<div class="flex justify-between gap-2">
		<p class="chip variant-filled py-1">€{productGroupDetailed.products[0].price}</p>
		<button
			class="btn btn-sm variant-ghost-success"
			on:click={() =>
				cartStore.add({
					product: productGroupDetailed.products[0],
					productGroup: getProductGroup(productGroupDetailed),
					quantity: 1
				})}>Add To Cart</button
		>
	</div>
</div>
