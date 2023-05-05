<script lang="ts">
	import { cartStore } from '$lib/stores/cart';
	import {
		popup,
		toastStore,
		type PopupSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import PreviewCartItem from '$lib/components/PreviewCartItem.svelte';
	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';

	const cartMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'cart-menu',
		// TODO: Fix closequery after https://github.com/skeletonlabs/skeleton/issues/1350 is closed
		closeQuery: 'marquee'
	};

	let totalPrice = 0;
	$: {
		let result = 0;
		for (const cartItem of $cartStore) {
			result += cartItem.product.price * cartItem.quantity;
		}
		totalPrice = result;
	}

	let checkingOut: boolean = false;
	const checkout = async () => {
		checkingOut = true;
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
		checkingOut = false;
	};
</script>

<button class="btn" use:popup={cartMenuPopupSettings} aria-label="shopping-cart">
	<svg class="w-8 fill-token" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
		><path
			d="M432 928a48 48 0 1 1 0-96 48 48 0 0 1 0 96zm320 0a48 48 0 1 1 0-96 48 48 0 0 1 0 96zM96 128a32 32 0 0 1 0-64h160a32 32 0 0 1 31.36 25.728L320.64 256H928a32 32 0 0 1 31.296 38.72l-96 448A32 32 0 0 1 832 768H384a32 32 0 0 1-31.36-25.728L229.76 128H96zm314.24 576h395.904l82.304-384H333.44l76.8 384z"
		/></svg
	>
</button>
<div class="card p-4 w-64" data-popup="cart-menu">
	<ul class="flex flex-col gap-2 h-48 overflow-scroll">
		{#each [...$cartStore.values()] as cartItem (cartItem.product.id)}
			<span animate:flip={{ duration: 400 }}>
				<PreviewCartItem {cartItem} />
			</span>
		{:else}
			<p>Your shopping cart is empty. <a class="underline" href="/clothing">Start shopping.</a></p>
		{/each}
	</ul>
	<hr />
	<div class="mt-4 flex flex-col gap-2">
		<p>Total: €{totalPrice}</p>
		<div class="flex justify-between">
			<button
				disabled={$cartStore.length === 0 || checkingOut}
				class="btn variant-ringed-primary"
				on:click={checkout}
			>
				{#if checkingOut}
					Working...
				{:else}
					Checkout
				{/if}
			</button>
			<button
				disabled={$cartStore.length === 0}
				class="btn p-2 variant-filled-error"
				on:click={() => cartStore.clear()}
			>
				<svg
					class="h-6 w-6 fill-token"
					version="1.1"
					id="Layer_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 492.308 492.308"
					xml:space="preserve"
					><g>
						<g>
							<rect
								x="151.852"
								y="163.175"
								transform="matrix(0.9971 -0.0764 0.0764 0.9971 -21.7697 13.2064)"
								width="19.692"
								height="255.833"
							/>
						</g></g
					><g> <g> <rect x="236.308" y="163.545" width="19.692" height="255.084" /> </g></g><g>
						<g>
							<rect
								x="202.697"
								y="281.247"
								transform="matrix(0.0762 -0.9971 0.9971 0.0762 15.1818 598.5728)"
								width="255.831"
								height="19.692"
							/>
						</g></g
					><g>
						<g>
							<path
								d="M448.627,70.115h-51.173V27.577C397.454,12.375,385.089,0,369.887,0H122.416c-15.202,0-27.567,12.375-27.567,27.577			v42.538H43.675H14.752v19.692h31.363L91.06,452.51c2.813,22.692,22.178,39.798,45.043,39.798H356.2			c22.865,0,42.231-17.106,45.043-39.798l44.945-362.702h31.368V70.115H448.627z M114.541,27.577c0-4.346,3.534-7.885,7.875-7.885			h247.471c4.341,0,7.875,3.538,7.875,7.885v42.538H114.541V27.577z M381.704,450.087c-1.596,12.846-12.558,22.529-25.505,22.529			H136.103c-12.947,0-23.909-9.683-25.505-22.529L65.954,89.808h28.894h302.606h28.894L381.704,450.087z"
							/>
						</g></g
					></svg
				>
			</button>
		</div>
	</div>
</div>
