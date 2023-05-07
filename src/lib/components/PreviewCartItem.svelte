<script lang="ts">
	import { cartStore } from '$lib/stores/cart';
	import { scale } from 'svelte/transition';
	export let cartItem: CartItem;
</script>

<li class="flex justify-between items-center" transition:scale={{ duration: 400 }}>
	<div class="flex flex-col">
		<p class="overflow-ellipsis">{cartItem.productGroup.name}</p>
		<div class="flex justify-between w-32">
			<p class="!text-[0.75rem] leading-0 opacity-75">Qt: {cartItem.quantity}</p>
			<p class="!text-[0.75rem] leading-0 opacity-75">
				€{cartItem.product.price * cartItem.quantity}
			</p>
		</div>
	</div>
	<div>
		<button class="btn btn-sm variant-filled-error" on:click={() => cartStore.remove(cartItem)}
			>-</button
		>
		<button class="btn btn-sm variant-filled-success" on:click={() => cartStore.add(cartItem)}
			>+</button
		>
	</div>
</li>
