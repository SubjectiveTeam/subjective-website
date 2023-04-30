<script lang="ts">
	import { cartStore } from '$lib/stores/cart';
	export let product: Product;
</script>

<div class="card p-4 w-64">
	<p>{product.name}</p>
	<img src={product.images[0]} alt={product.name + 'Thumbnail'} />
	<div class="flex justify-between">
		<p class="chip variant-filled py-1">€{product.price}</p>
		<button class="btn btn-sm variant-ghost-success" on:click={() => cartStore.add(product)}
			>Add To Cart</button
		>
	</div>
</div>
