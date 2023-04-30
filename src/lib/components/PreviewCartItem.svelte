<script lang="ts">
	import { cartStore } from '$lib/stores/cart';
	export let cartItem: CartItem;
</script>

<li class="flex justify-between items-center px-">
	<div class="flex flex-col">
		<p class="overflow-ellipsis">{cartItem.product.name}</p>
		<div class="flex justify-between">
			<p class="!text-[0.75rem] leading-0 opacity-75">Qt: {cartItem.quantity}</p>
			<p class="!text-[0.75rem] leading-0 opacity-75">${cartItem.product.price}</p>
		</div>
	</div>
	<div>
		<button
			class="btn btn-sm variant-filled-error"
			on:click={() => cartStore.remove(cartItem.product)}>-</button
		>
		<button
			class="btn btn-sm variant-filled-success"
			on:click={() => cartStore.add(cartItem.product)}>+</button
		>
	</div>
</li>
