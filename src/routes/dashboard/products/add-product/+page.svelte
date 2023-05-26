<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import {
		SlideToggle,
		toastStore,
		type PopupSettings,
		ListBox,
		ListBoxItem,
		popup
	} from '@skeletonlabs/skeleton';

	export let data;

	const { form, errors, constraints, enhance, capture, restore, submitting } = superForm(
		data.form,
		{
			applyAction: true,
			onResult({ result }) {
				if (result.type === 'success') {
					toastStore.trigger({
						message: result.data?.message,
						background: 'variant-filled-success'
					});
				} else if (result.type === 'failure') {
					toastStore.trigger({ message: result.data?.message, background: 'variant-filled-error' });
				}
			}
		}
	);

	export const snapshot = { capture, restore };

	// Populate size value with M
	form.update(
		($form) => {
			$form.size = 'M';
			return $form;
		},
		{ taint: false }
	);

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'combobox',
		placement: 'bottom',
		// Close the popup when the item is clicked
		closeQuery: '.listbox-item'
	};

	const activeConstraints = { ...$constraints.active, required: undefined };
</script>

<h1 class="h1 !leading-loose">Add Product</h1>
<section class="flex flex-col gap-10 card p-16">
	<form class="flex flex-col gap-16" method="post" use:enhance>
		<div class="flex flex-col gap-4">
			<label for="productGroupId" class="label">
				<span>Product Group ID</span>
				<input
					class="input"
					type="text"
					name="productGroupId"
					placeholder="Product Group ID"
					disabled={$submitting}
					data-invalid={$errors.productGroupId}
					bind:value={$form.productGroupId}
					{...$constraints.productGroupId}
				/>
			</label>
			{#if $errors.productGroupId}<span class="!text-error-500">{$errors.productGroupId}</span>{/if}

			<label for="price" class="label">
				<span>Price</span>
				<input
					class="input"
					type="number"
					name="price"
					placeholder="Price"
					disabled={$submitting}
					data-invalid={$errors.price}
					bind:value={$form.price}
					{...$constraints.price}
				/>
			</label>
			{#if $errors.price}<span class="!text-error-500">{$errors.price}</span>{/if}
			<label for="stock" class="label">
				<span>Stock</span>
				<input
					class="input"
					type="number"
					name="stock"
					disabled={$submitting}
					placeholder="Amount in stock"
					data-invalid={$errors.stock}
					bind:value={$form.stock}
					{...$constraints.stock}
				/>
			</label>
			{#if $errors.stock}<span class="!text-error-500">{$errors.stock}</span>{/if}
			<label for="size" class="label">
				<span>Size</span>
				<button type="button" class="btn input mt-1" use:popup={popupCombobox}>
					{$form.size}
				</button>
				<div class="card w-48 shadow-xl py-2 z-50" data-popup="combobox">
					<ListBox
						rounded="rounded-none"
						{...$constraints.size}
						data-invalid={$errors.size}
						disabled={$submitting}
					>
						<ListBoxItem bind:group={$form.size} name="size" value="XL">XL</ListBoxItem>
						<ListBoxItem bind:group={$form.size} name="size" value="L">L</ListBoxItem>
						<ListBoxItem bind:group={$form.size} name="size" value="M">M</ListBoxItem>
						<ListBoxItem bind:group={$form.size} name="size" value="S">S</ListBoxItem>
					</ListBox>
					<div class="arrow bg-surface-100-800-token" />
				</div>
			</label>
			{#if $errors.size}<span class="!text-error-500">{$errors.size}</span>{/if}
			<label for="active" class="label flex flex-col">
				<span>Activate Product</span>
				<SlideToggle
					name="active"
					disabled={$submitting}
					bind:checked={$form.active}
					{activeConstraints}
					data-invalid={$errors.active}
				/>
			</label>
			{#if $errors.active}<span class="!text-error-500">{$errors.active}</span>{/if}
		</div>
		<div class="flex justify-end">
			<button disabled={$submitting} class="btn variant-filled-secondary">
				{#if $submitting}
					Working...
				{:else}
					Add Product
				{/if}
			</button>
		</div>
	</form>
</section>
