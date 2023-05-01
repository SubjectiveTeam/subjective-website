<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import {
		FileDropzone,
		InputChip,
		SlideToggle,
		modalStore,
		type ToastSettings,
		toastStore
	} from '@skeletonlabs/skeleton';

	const addProductCallback: SubmitFunction = () => {
		adding = true;
		return async ({ result }) => {
			await applyAction(result);
			if (result.type === 'success') {
				await invalidateAll();
				modalStore.close();
				const toast: ToastSettings = {
					message: 'Successfully added product',
					background: 'variant-filled-success'
				};
				toastStore.trigger(toast);
			} else {
				const toast: ToastSettings = {
					message: 'Something went wrong. Try again later',
					background: 'variant-filled-error'
				};
				toastStore.trigger(toast);
			}
			adding = false;
		};
	};

	let adding: boolean = false;
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-10 bg-surface-800 p-16">
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
							<input type="number" step="0.01" placeholder="Price" name="price" required />
						</div>
					</label>
					<span class="flex items-center justify-between">
						<label for="active">Activate Product</label>
						<SlideToggle class="mt-1" name="active" />
					</span>
				</div>

				<div class="flex flex-col gap-4 justify-between">
					<span>
						<label for="sizes">Sizes {'(XL, L, M, S)'}</label>
						<InputChip
							class="mt-1"
							name="sizes"
							label="Sizes"
							placeholder="Sizes"
							allowDuplicates={false}
							whitelist={['XL', 'L', 'M', 'S']}
							allowUpperCase
							required
						/>
					</span>
					<span>
						<label for="tags">Tags</label>
						<InputChip class="mt-1" name="tags" placeholder="Tags" allowDuplicates={false} />
					</span>
					<span>
						<label for="images">Images</label>
						<FileDropzone class="mt-1" name="images" multiple required />
					</span>
				</div>
			</div>

			<div class="flex gap-4 justify-between">
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
