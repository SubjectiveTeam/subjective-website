<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import {
		InputChip,
		SlideToggle,
		modalStore,
		type ToastSettings,
		toastStore
	} from '@skeletonlabs/skeleton';

	export let product: Product;

	const updateProductCallback: SubmitFunction = () => {
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
			} else {
				const toast: ToastSettings = {
					message: 'Something went wrong. Try again later.',
					background: 'variant-filled-error'
				};
				toastStore.trigger(toast);
			}
		};
	};

	let editing: boolean = false;
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-10 bg-surface-800 p-16">
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
					<span class="flex items-center justify-between">
						<label for="active">Activate Product</label>
						<SlideToggle class="mt-1" name="active" bind:checked={product.active} />
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
							bind:value={product.sizes}
							required
						/>
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
				</div>
			</div>

			<div class="flex gap-4 mt-8 justify-between">
				<button class="btn variant-ringed-error" type="reset" on:click={() => modalStore.close()}
					>Cancel</button
				>
				<button disabled={editing} class="btn variant-filled-secondary">
					{#if editing}
						Working...
					{:else}
						Update Product
					{/if}
				</button>
			</div>
		</form>
	</div>
{/if}
