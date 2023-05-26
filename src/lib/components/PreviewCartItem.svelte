<script lang="ts">
	import { cartStore } from '$lib/stores/cart';
	import Fa from 'svelte-fa';
	import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
	export let cartItem: CartItem;
</script>

<div class="flex justify-between items-center">
	<a href="/clothing/{cartItem.productGroup.id}">
		<p class="overflow-ellipsis">{cartItem.productGroup.name}</p>
		<p
			class="!text-[0.85rem] !leading-5 opacity-75 overflow-hidden whitespace-nowrap !text-ellipsis w-24"
		>
			{cartItem.productGroup.description}
		</p>
		<div class="flex justify-between w-32">
			<p class="!text-[0.75rem] leading-0 opacity-75">Qt: {cartItem.quantity}</p>
			<p class="!text-[0.75rem] leading-0 opacity-75">
				€{cartItem.product.price * cartItem.quantity}
			</p>
		</div>
	</a>
	<div>
		<button class="btn btn-sm p-2 variant-filled-error" on:click={() => cartStore.remove(cartItem)}
			><Fa class="text-token" icon={faMinus} /></button
		>
		<button class="btn btn-sm p-2 variant-filled-success" on:click={() => cartStore.add(cartItem)}
			><Fa class="text-token" icon={faPlus} /></button
		>
	</div>
</div>
