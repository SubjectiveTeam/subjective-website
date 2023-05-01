<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import {
		modalStore,
		type ModalSettings,
		type ModalComponent,
		toastStore,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import AddProductModal from '$lib/components/AddProductModal.svelte';
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';

	export let products: Product[];

	const triggerAddProductModal = () => {
		const modalComponent: ModalComponent = {
			ref: AddProductModal
		};
		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent
		};
		modalStore.trigger(modal);
	};

	const updateProductCallback: SubmitFunction = () => {
		return async ({ result }) => {
			await applyAction(result);
			if (result.type === 'success') {
				await refreshProducts();
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

	let refreshingProducts: boolean = false;
	const refreshProducts = async () => {
		refreshingProducts = true;
		await invalidateAll();
		refreshingProducts = false;
	};
</script>

<section class="flex flex-col gap-4">
	<div class="ml-auto">
		<button
			disabled={refreshingProducts}
			class="btn btn-sm variant-filled-tertiary"
			on:click={refreshProducts}
		>
			{#if refreshingProducts}
				Working...
			{:else}
				Refresh
			{/if}
		</button>
		<button class="btn btn-sm variant-filled-secondary" on:click={triggerAddProductModal}
			>Add Product</button
		>
	</div>
	{#if products.length > 0}
		<div class="table-container">
			<table class="table table-hover">
				<thead>
					<tr>
						<th>ID</th>
						<th>Stripe_Price</th>
						<th>Name</th>
						<th>Description</th>
						<th>Price</th>
						<th>Active</th>
						<th>Sizes</th>
						<th>Tags</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#each products as product, i}
						<tr>
							<td>{product.id}</td>
							<td>{product.stripe_price}</td>
							<td>{product.name}</td>
							<td>{product.description}</td>
							<td>€{product.price}</td>
							<td>{product.active}</td>
							<td>{product.sizes}</td>
							<td>{product.tags}</td>
							<td>
								<!-- TODO Create modal just like add product modal for editing existing product  -->
								<form
									action="?/updateProduct&product={JSON.stringify(product)}"
									method="post"
									use:enhance={updateProductCallback}
								>
									<button class="btn btn-sm variant-filled-error">Edit</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="text-center">No Products</p>
	{/if}
</section>
