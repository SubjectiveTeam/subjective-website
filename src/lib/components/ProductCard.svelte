<script lang="ts">
	import { cartStore } from '$lib/stores/cart';

	export let productGroupDetailed: ProductGroupDetailed;

	function getProductGroup(productGroupDetailed: ProductGroupDetailed): ProductGroup {
		return {
			name: productGroupDetailed.name,
			description: productGroupDetailed.description,
			images: productGroupDetailed.images
		} as ProductGroup;
	}
</script>

<div class="card">
	<header class="card-header">
		<p class="font-bold !text-xl">{productGroupDetailed.name}</p>
		<p class="!text-sm">{productGroupDetailed.description}</p>
	</header>
	<a href="/clothing/{productGroupDetailed.id}">
		<section class="p-4 relative group">
			{#if productGroupDetailed.images}
				<img
					class="rounded-token transition-opacity duration-350 group-hover:opacity-50"
					src={productGroupDetailed?.images[0]}
					alt={productGroupDetailed.name}
					loading="lazy"
				/>
			{/if}
			<ul
				class="flex absolute top-[calc(1rem+1vw)] right-[calc(1rem+1vw)] gap-2 transition duration-350 opacity-0 translate-x-[1rem] group-hover:translate-x-0 group-hover:opacity-100"
			>
				{#each productGroupDetailed.products as product}
					<li class="chip variant-filled-primary">{product.size}</li>
				{/each}
			</ul>
			<p
				class="!text-token font-bold text-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 duration-350 transition-opacity group-hover:opacity-100"
			>
				View Product
			</p>
		</section>
	</a>
	<footer class="card-footer flex justify-between">
		{#if productGroupDetailed.products.length > 0}
			<p class="chip variant-filled py-1">€{productGroupDetailed.products[0].price}</p>
		{/if}
		<button
			class="btn btn-sm variant-ghost-success"
			on:click={() =>
				cartStore.add({
					product: productGroupDetailed.products[0],
					productGroup: getProductGroup(productGroupDetailed),
					quantity: 1
				})}>Add To Cart</button
		>
	</footer>
</div>
