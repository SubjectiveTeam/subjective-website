<script lang="ts">
	import { cartStore } from '$lib/stores/cart';
	import {
		popup,
		toastStore,
		type PopupSettings,
		type ToastSettings,
		ProgressRadial
	} from '@skeletonlabs/skeleton';
	import PreviewCartItem from '$lib/components/PreviewCartItem.svelte';
	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import Fa from 'svelte-fa';
	import { faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';

	const cartMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'cart-menu',
		closeQuery: ''
	};

	let totalPrice = 0;
	$: {
		let result = 0;
		for (const cartItem of $cartStore) {
			result += cartItem.product.price * cartItem.quantity;
		}
		totalPrice = result;
	}

	let working = false;
	const checkout = async () => {
		working = true;
		const checkoutResponse: CheckoutResponse = await cartStore.checkout();

		if (checkoutResponse.type === 'success' && checkoutResponse.url) {
			await goto(checkoutResponse.url);
		} else {
			const toast: ToastSettings = {
				message: 'Something went wrong while checking out. Try again later.',
				background: 'variant-filled-error'
			};
			toastStore.trigger(toast);
		}
		working = false;
	};
</script>

<button class="btn" use:popup={cartMenuPopupSettings} aria-label="shopping-cart">
	<Fa size="2x" class="text-token" icon={faShoppingCart} />
</button>
<div class="card p-4 w-64" data-popup="cart-menu">
	<ul class="h-48 overflow-y-scroll">
		{#each [...$cartStore.values()] as cartItem (cartItem.product.id)}
			<li animate:flip={{ duration: 200 }}>
				<PreviewCartItem {cartItem} />
			</li>
		{:else}
			<p>Your shopping cart is empty. <a class="underline" href="/clothing">Start shopping.</a></p>
		{/each}
	</ul>
	<hr />
	<div class="mt-4 flex flex-col gap-2">
		<p>Total: €{totalPrice}</p>
		<div class="flex justify-between">
			<button
				disabled={$cartStore.length === 0 || working}
				class="btn variant-ringed-primary"
				on:click={checkout}
			>
				{#if working}
					<span class="flex items-center gap-2">
						<ProgressRadial width="w-3" stroke={150} value={undefined} />
						Working...
					</span>
				{:else}
					Checkout
				{/if}
			</button>
			<button
				aria-label="clear-shopping-cart"
				disabled={$cartStore.length === 0}
				class="btn p-2 variant-filled-error"
				on:click={() => cartStore.clear()}
			>
				<Fa class="text-token" icon={faTrash} />
			</button>
		</div>
	</div>
</div>
