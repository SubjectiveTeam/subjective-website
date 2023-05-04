<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import {
		SlideToggle,
		toastStore,
		type PopupSettings,
		ListBox,
		ListBoxItem,
		popup,
		FileDropzone
	} from '@skeletonlabs/skeleton';

	export let data;

	const { form, errors, constraints, enhance } = superForm(data.form, {
		applyAction: true,
		resetForm: true,
		onSubmit() {
			working = true;
		},
		onResult({ result }) {
			if (result.type === 'success') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-success' });
			} else if (result.type === 'failure') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-error' });
				working = false;
			}
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

	let working: boolean = false;
</script>

<section class="flex flex-col gap-10 card p-16">
	<h1 class="!leading-loose">Add Product</h1>
	<form class="flex flex-col gap-16" method="post" use:enhance>
		<div class="flex flex-col md:flex-row gap-4">
			<div class="flex-1 flex flex-col gap-4">
				<input
					class="input"
					type="text"
					name="name"
					placeholder="Name"
					data-invalid={$errors.name}
					bind:value={$form.name}
					{...$constraints.name}
				/>
				{#if $errors.name}<span class="!text-error-500">{$errors.name}</span>{/if}
				<textarea
					class="input resize-none"
					name="description"
					placeholder="Description"
					data-invalid={$errors.description}
					bind:value={$form.description}
					{...$constraints.description}
				/>
				{#if $errors.description}<span class="!text-error-500">{$errors.description}</span>{/if}
				<input
					class="input"
					type="number"
					name="price"
					placeholder="Price"
					data-invalid={$errors.price}
					bind:value={$form.price}
					{...$constraints.price}
				/>
				{#if $errors.price}<span class="!text-error-500">{$errors.price}</span>{/if}
				<input
					class="input"
					type="number"
					name="stock"
					placeholder="Amount in stock"
					data-invalid={$errors.stock}
					bind:value={$form.stock}
					{...$constraints.stock}
				/>
				{#if $errors.stock}<span class="!text-error-500">{$errors.stock}</span>{/if}
			</div>
			<div class="flex-1 flex flex-col gap-4">
				<button type="button" class="btn input mt-1" use:popup={popupCombobox}>
					{$form.size}
				</button>
				<div class="card w-48 shadow-xl py-2 z-50" data-popup="combobox">
					<ListBox rounded="rounded-none" {...$constraints.size} data-invalid={$errors.size}>
						<ListBoxItem bind:group={$form.size} name="size" value="XL">XL</ListBoxItem>
						<ListBoxItem bind:group={$form.size} name="size" value="L">L</ListBoxItem>
						<ListBoxItem bind:group={$form.size} name="size" value="M">M</ListBoxItem>
						<ListBoxItem bind:group={$form.size} name="size" value="S">S</ListBoxItem>
					</ListBox>
					<div class="arrow bg-surface-100-800-token" />
				</div>
				{#if $errors.size}<span class="!text-error-500">{$errors.size}</span>{/if}
				<FileDropzone name="files" required multiple />
				<label for="active" class="label flex items-center justify-evenly">
					<span>Activate Product</span>
					<SlideToggle
						name="active"
						bind:checked={$form.active}
						{...$constraints.active}
						data-invalid={$errors.active}
					/>
					{#if $errors.active}<span class="!text-error-500">{$errors.active}</span>{/if}
				</label>
			</div>
		</div>

		<div class="flex justify-end">
			<button disabled={working} class="btn variant-filled-secondary">
				{#if working}
					Working...
				{:else}
					Add Product
				{/if}
			</button>
		</div>
	</form>
</section>
