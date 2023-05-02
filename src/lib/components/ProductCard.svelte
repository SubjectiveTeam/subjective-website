<script lang="ts">
	import { cartStore } from '$lib/stores/cart';
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	export let product: Product;

	export let size: string = 'M';

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'combobox',
		placement: 'bottom',
		// Close the popup when the item is clicked
		closeQuery: '.listbox-item'
	};
</script>

<div class="card p-4 w-64">
	<p>{product.name}</p>

	<img src={product.images[0]} alt={product.name} />
	<div class="flex justify-between">
		<p class="chip variant-filled py-1">€{product.price}</p>
		<button class="btn variant-filled w-8" use:popup={popupCombobox}>
			{size}
		</button>
		<div class="card w-48 shadow-xl py-2" data-popup="combobox">
			<ListBox rounded="rounded-none">
				<ListBoxItem bind:group={size} name="size" value="XL">XL</ListBoxItem>
				<ListBoxItem bind:group={size} name="size" value="L">L</ListBoxItem>
				<ListBoxItem bind:group={size} name="size" value="M">M</ListBoxItem>
				<ListBoxItem bind:group={size} name="size" value="S">S</ListBoxItem>
			</ListBox>
			<div class="arrow bg-surface-100-800-token" />
		</div>
		<button
			class="btn btn-sm variant-ghost-success"
			on:click={() => cartStore.add({ product, quantity: 1 })}>Add To Cart</button
		>
	</div>
</div>
