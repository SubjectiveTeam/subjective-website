<script lang="ts">
	import { cartStore } from '$lib/stores/cart';

	export let product: Product;
</script>

<div class="card p-4 flex flex-col gap-4">
	<p class="font-bold !text-xl">{product.name}</p>
	<p class="!text-sm">{product.description}</p>
	<img class="rounded-token" src={product.images[0]} alt={product.name} loading="lazy" />
	<div class="flex justify-between gap-2">
		<p class="chip variant-filled py-1">€{product.price}</p>
		<p class="chip variant-filled-primary py-1">{product.size}</p>
		<button
			class="btn btn-sm variant-ghost-success"
			on:click={() => cartStore.add({ product, quantity: 1 })}>Add To Cart</button
		>
	</div>
</div>
