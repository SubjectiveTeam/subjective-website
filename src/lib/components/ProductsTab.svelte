<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { modalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';
	import AddProductModal from '$lib/components/AddProductModal.svelte';

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

	const triggerDeleteProductModal = () => {};

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
						<th>Stripe_ID</th>
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
							<td>{product.stripe_id}</td>
							<td>{product.stripe_price}</td>
							<td>{product.name}</td>
							<td>{product.description}</td>
							<td>€{product.price}</td>
							<td>{product.active}</td>
							<td>{product.sizes}</td>
							<td>{product.tags}</td>
							<td>
								<form action="?/deleteProduct&product={JSON.stringify(product)}" method="post">
									<button class="btn btn-sm variant-filled-error">
										<svg
											class="h-4 aspect-square fill-token"
											viewBox="0 0 32 32"
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M8 26c0 1.656 1.343 3 3 3h10c1.656 0 3-1.344 3-3l2-16h-20l2 16zM19 13h2v13h-2v-13zM15 13h2v13h-2v-13zM11 13h2v13h-2v-13zM25.5 6h-6.5c0 0-0.448-2-1-2h-4c-0.553 0-1 2-1 2h-6.5c-0.829 0-1.5 0.671-1.5 1.5s0 1.5 0 1.5h22c0 0 0-0.671 0-1.5s-0.672-1.5-1.5-1.5z"
											/>
										</svg>
									</button>
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
