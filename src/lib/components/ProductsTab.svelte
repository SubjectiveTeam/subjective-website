<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	export let products: Product[];

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
		<a class="btn btn-sm variant-filled-secondary" href="/dashboard/add-product">Add Product</a>
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
						<th>Stock</th>
						<th>Active</th>
						<th>Size</th>
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
							<td>{product.stock}</td>
							<td>{product.active}</td>
							<td>{product.size}</td>
							<td>
								<a
									class="btn btn-sm variant-filled-primary"
									href="/dashboard/update-product?product_id={product.id}">Edit</a
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
