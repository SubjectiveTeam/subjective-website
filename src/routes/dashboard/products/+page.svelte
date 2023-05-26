<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	export let data;

	let refreshing: boolean = false;
	const refresh = async () => {
		refreshing = true;
		await invalidateAll();
		refreshing = false;
	};
</script>

<section class="flex flex-col gap-4">
	<div class="ml-auto">
		<button disabled={refreshing} class="btn btn-sm variant-filled-tertiary" on:click={refresh}>
			{#if refreshing}
				Working...
			{:else}
				Refresh
			{/if}
		</button>
		<a class="btn btn-sm variant-filled-secondary" href="/dashboard/product/add-product"
			>Add Product</a
		>
	</div>
	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>ID</th>
					<th>Product Group ID</th>
					<th>Stripe_Price</th>
					<th>Price</th>
					<th>Stock</th>
					<th>Active</th>
					<th>Size</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{#each data.products as product, i}
					<tr>
						<td>{product.id}</td>
						<td>{product.product_group_id}</td>
						<td>{product.stripe_price}</td>
						<td>€{product.price}</td>
						<td>{product.stock}</td>
						<td>{product.active}</td>
						<td>{product.size}</td>
						<td>
							<a
								class="btn btn-sm variant-filled-primary"
								href="/dashboard/product/update-product?product_id={product.id}">Edit</a
							>
						</td>
					</tr>
				{:else}
					<p class="text-center p-4">No Products</p>
				{/each}
			</tbody>
		</table>
	</div>
</section>
