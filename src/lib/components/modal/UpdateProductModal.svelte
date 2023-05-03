<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import {
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

	export let product: Product;

	const updateProductCallback: SubmitFunction = () => {
		updating = true;
		return async ({ result }) => {
			await applyAction(result);
			if (result.type === 'success') {
				await invalidateAll();
				modalStore.close();
				const toast: ToastSettings = {
					message: 'Successfully updated product.',
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
			updating = false;
		};
	};

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'combobox',
		placement: 'bottom',
		// Close the popup when the item is clicked
		closeQuery: '.listbox-item'
	};


	let updating: boolean = false;
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-10 bg-surface-100-800-token p-16">
		<h1 class="!leading-loose">Update Product</h1>
		<form
			class="flex flex-col gap-4"
			method="post"
			action="?/updateProduct"
			use:enhance={updateProductCallback}
		>
			<div class="flex gap-4">
				<div class="flex flex-col gap-4 justify-between">
					<label class="label">
						<span>ID</span>
						<input
							class="input"
							type="text"
							placeholder="ID"
							name="id"
							required
							readonly
							bind:value={product.id}
						/>
					</label>
					<label class="label">
						<span>Name</span>
						<input
							class="input"
							type="text"
							placeholder="Name"
							name="name"
							required
							bind:value={product.name}
						/>
					</label>
					<label class="label">
						<span>Description</span>
						<input
							class="input"
							type="text"
							placeholder="Description"
							name="description"
							required
							bind:value={product.description}
						/>
					</label>
					<label class="label">
						<span>Amount in stock:</span>
						<input class="input" type="number" min=0 step=1 placeholder="Amount in stock" name="stock" required />
					</label>
				</div>

				<div class="flex flex-col gap-4 justify-between">
					<span>	
						<label for="size">Size</label>
						<button type="button" class="btn input mt-1" use:popup={popupCombobox}>
							{product.size}
						</button>
						<div class="card w-48 shadow-xl py-2 z-50" data-popup="combobox">
							<ListBox rounded="rounded-none">
								<ListBoxItem bind:group={product.size} name="size" value="XL">XL</ListBoxItem>
								<ListBoxItem bind:group={product.size} name="size" value="L">L</ListBoxItem>
								<ListBoxItem bind:group={product.size} name="size" value="M">M</ListBoxItem>
								<ListBoxItem bind:group={product.size} name="size" value="S">S</ListBoxItem>
							</ListBox>
							<div class="arrow bg-surface-100-800-token" />
						</div>
					</span>
					<span>
						<label for="tags">Tags</label>
						<InputChip
							class="mt-1"
							name="tags"
							placeholder="Tags"
							allowDuplicates={false}
							bind:value={product.tags}
						/>
					</span>
					<span class="flex items-center justify-between">
						<label for="active">Activate Product</label>
						<SlideToggle class="mt-1" name="active" bind:checked={product.active} />
					</span>
				</div>
			</div>
			<div class="flex gap-4 mt-8 justify-between">
				<button class="btn variant-ringed-error" type="reset" on:click={() => modalStore.close()}
					>Cancel</button
				>
				<button disabled={updating} class="btn variant-filled-secondary">
					{#if updating}
						Working...
					{:else}
						Update Product
					{/if}
				</button>
			</div>
		</form>
	</div>
{/if}
