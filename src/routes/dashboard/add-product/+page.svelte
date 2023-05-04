<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import {
		SlideToggle,
		modalStore,
		toastStore,
		type PopupSettings,
		ListBox,
		ListBoxItem,
		popup
	} from '@skeletonlabs/skeleton';

	export let addProductForm;

	const { form, errors, constraints, enhance, message } = superForm(addProductForm, {
		invalidateAll: true,
		applyAction: true,
		onSubmit() {
			adding = true;
		},
		onResult({ result }) {
			if (result.type === 'success') {
				modalStore.close();
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-error' });
			} else if (result.type === 'failure') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-error' });
			}
			adding = false;
		}
	});

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

	let adding: boolean = false;
</script>

<section class="flex flex-col gap-10 bg-surface-100-800-token p-16">
	<h1 class="!leading-loose">Add Product</h1>
	<SuperDebug data={$form} />
	<form class="flex flex-col gap-4" method="post" use:enhance>
		<input
			class="input"
			type="text"
			name="name"
			placeholder="Name"
			bind:value={$form.name}
			{...$constraints.name}
		/>
		{#if $errors.name}<span class="!text-error-500">{$errors.name}</span>{/if}
		<textarea
			class="input resize-none"
			name="description"
			placeholder="Description"
			bind:value={$form.description}
			{...$constraints.description}
		/>
		{#if $errors.description}<span class="!text-error-500">{$errors.description}</span>{/if}
		<input
			class="input"
			type="number"
			name="price"
			placeholder="Price"
			bind:value={$form.price}
			{...$constraints.price}
		/>
		{#if $errors.price}<span class="!text-error-500">{$errors.price}</span>{/if}
		<input
			class="input"
			type="number"
			name="stock"
			placeholder="Amount in stock"
			bind:value={$form.stock}
			{...$constraints.stock}
		/>
		{#if $errors.stock}<span class="!text-error-500">{$errors.stock}</span>{/if}
		<button type="button" class="btn input mt-1" use:popup={popupCombobox}>
			{$form.size}
		</button>
		<div class="card w-48 shadow-xl py-2 z-50" data-popup="combobox">
			<ListBox rounded="rounded-none" {...$constraints.size}>
				<ListBoxItem bind:group={$form.size} name="size" value="XL">XL</ListBoxItem>
				<ListBoxItem bind:group={$form.size} name="size" value="L">L</ListBoxItem>
				<ListBoxItem bind:group={$form.size} name="size" value="M">M</ListBoxItem>
				<ListBoxItem bind:group={$form.size} name="size" value="S">S</ListBoxItem>
			</ListBox>
			<div class="arrow bg-surface-100-800-token" />
		</div>
		{#if $errors.size}<span class="!text-error-500">{$errors.size}</span>{/if}
		<input type="file" multiple name="files" bind:value={$form.files} {...$constraints.files} />
		{#if $errors.files}<span class="!text-error-500">{$errors.files}</span>{/if}
		<SlideToggle name="active" bind:checked={$form.active} {...$constraints.active} />

		<div class="flex gap-4 mt-8 justify-between">
			<button class="btn variant-ringed-error" type="reset" on:click={() => modalStore.close()}
				>Cancel</button
			>
			<button disabled={adding} class="btn variant-filled-secondary">
				{#if adding}
					Working...
				{:else}
					Add Product
				{/if}
			</button>
		</div>
	</form>
</section>
