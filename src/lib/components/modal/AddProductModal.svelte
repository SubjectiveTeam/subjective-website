<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import {
		FileDropzone,
		InputChip,
		SlideToggle,
		modalStore,
		type ToastSettings,
		toastStore,
		type PopupSettings,
		ListBox,
		ListBoxItem,
		popup
	} from '@skeletonlabs/skeleton';

	export let addProductForm;

	const { form, errors, enhance, message } = superForm(addProductForm, {
		invalidateAll: true,
		applyAction: true,
		onResult(({ result }) => {
			
		});
	});


	const addProductCallback: SubmitFunction = () => {
		adding = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				modalStore.close();
				const toast: ToastSettings = {
					message: 'Successfully added product',
					background: 'variant-filled-success'
				};
				toastStore.trigger(toast);
			} else if (result.type === 'failure') {
				const toast: ToastSettings = {
					message: result.data?.message,
					background: 'variant-filled-error'
				};
				toastStore.trigger(toast);
			}
			adding = false;
		};
	};

	export let size: string = 'M';

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'combobox',
		placement: 'bottom',
		// Close the popup when the item is clicked
		closeQuery: '.listbox-item'
	};

	let adding: boolean = false;


	function superForm(loginForm: any, arg1: { invalidateAll: boolean; }): { form: any; errors: any; enhance: any; message: any; } {
		throw new Error('Function not implemented.');
	}
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-10 bg-surface-100-800-token p-16">
		<h1 class="!leading-loose">Add Product</h1>
		<form
			class="flex flex-col gap-4"
			method="post"
			action="?/addProduct"
			use:enhance={addProductCallback}
		>
			<div class="flex gap-4">
				<div class="flex flex-col gap-4 justify-between">
					<label class="label">
						<span>Name</span>
						<input class="input" type="text" placeholder="Name" name="name" required />
					</label>
					<label class="label">
						<span>Description</span>
						<input
							class="input"
							type="text"
							placeholder="Description"
							name="description"
							required
						/>
					</label>
					<label class="label">
						<span>Price</span>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<div class="input-group-shim hide-number-input-arrows">€</div>
							<input type="number" min="0" step="0.01" placeholder="Price" name="price" required />
						</div>
					</label>
					<label class="label">
						<span>Amount in stock:</span>
						<input
							class="input"
							type="number"
							min="0"
							step="1"
							placeholder="Amount in stock"
							name="stock"
							required
						/>
					</label>
				</div>

				<div class="flex flex-col gap-4 justify-between">
					<span>
						<label for="size">Size</label>
						<button type="button" class="btn input mt-1" use:popup={popupCombobox}>
							{size}
						</button>
						<div class="card w-48 shadow-xl py-2 z-50" data-popup="combobox">
							<ListBox rounded="rounded-none">
								<ListBoxItem bind:group={size} name="size" value="XL">XL</ListBoxItem>
								<ListBoxItem bind:group={size} name="size" value="L">L</ListBoxItem>
								<ListBoxItem bind:group={size} name="size" value="M">M</ListBoxItem>
								<ListBoxItem bind:group={size} name="size" value="S">S</ListBoxItem>
							</ListBox>
							<div class="arrow bg-surface-100-800-token" />
						</div>
					</span>
					<span>
						<label for="tags">Tags</label>
						<InputChip class="mt-1" name="tags" placeholder="Tags" allowDuplicates={false} />
					</span>
					<span>
						<label for="images">Images</label>
						<FileDropzone class="mt-1" name="images" multiple required />
					</span>
					<span class="flex items-center justify-between">
						<label for="active">Activate Product</label>
						<SlideToggle class="mt-1" name="active" />
					</span>
				</div>
			</div>

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
	</div>
{/if}
