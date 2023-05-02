<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { modalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';
	import AddProductModal from '$lib/components/modal/AddProductModal.svelte';
	import EditProductModal from '$lib/components/modal/UpdateProductModal.svelte';

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

	const triggerEditProductModal = (product: Product) => {
		const modalComponent: ModalComponent = {
			ref: EditProductModal,
			props: { product }
		};
		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent
		};
		modalStore.trigger(modal);
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
						<th>Size</th>
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
							<td>{product.size}</td>
							<td>{product.tags}</td>
							<td>
								<button
									class="btn btn-sm variant-filled-primary"
									on:click={() => triggerEditProductModal(product)}>Edit</button
								>
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
