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

	const { form, errors, constraints, enhance } = superForm(data.form, {
		applyAction: true,
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

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'combobox',
		placement: 'bottom',
		// Close the popup when the item is clicked
		closeQuery: '.listbox-item'
	};

	let working: boolean = false;
</script>

<h1 class="!leading-loose">Update Product</h1>
<section class="flex flex-col gap-10 card p-16">
	<form class="flex flex-col gap-16" method="post" use:enhance>
		<div class="flex flex-col md:flex-row gap-4">
			<div class="flex-1 flex flex-col gap-4">
				<label for="id" class="label">
					<span>ID</span>
					<input
						class="input"
						type="text"
						name="id"
						placeholder="ID"
						readonly
						data-invalid={$errors.id}
						bind:value={$form.id}
						{...$constraints.id}
					/>
				</label>
				{#if $errors.id}<span class="!text-error-500">{$errors.id}</span>{/if}
				<label for="name" class="label">
					<span>Name</span>
					<input
						class="input"
						type="text"
						name="name"
						placeholder="Name"
						data-invalid={$errors.name}
						bind:value={$form.name}
						{...$constraints.name}
					/>
				</label>
				{#if $errors.name}<span class="!text-error-500">{$errors.name}</span>{/if}
				<label for="description" class="label">
					<span>Description</span>
					<textarea
						class="input resize-none"
						name="description"
						placeholder="Description"
						data-invalid={$errors.description}
						bind:value={$form.description}
						{...$constraints.description}
					/>
				</label>
				{#if $errors.description}<span class="!text-error-500">{$errors.description}</span>{/if}
			</div>
			<div class="flex-1 flex flex-col gap-4">
				<label for="stock" class="label">
					<span>Stock</span>
					<input
						class="input"
						type="number"
						name="stock"
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
						<ListBox rounded="rounded-none" {...$constraints.size} data-invalid={$errors.size}>
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
						bind:checked={$form.active}
						{...$constraints.active}
						data-invalid={$errors.active}
					/>
				</label>
				{#if $errors.active}<span class="!text-error-500">{$errors.active}</span>{/if}
			</div>
		</div>

		<div class="flex justify-end">
			<button disabled={working} class="btn variant-filled-secondary">
				{#if working}
					Working...
				{:else}
					Update Product
				{/if}
			</button>
		</div>
	</form>
</section>
