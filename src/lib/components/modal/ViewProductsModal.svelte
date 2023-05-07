<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';

	export let products: OrderProduct[];

	const totalPrice = products.reduce((accumulator, product) => {
		return accumulator + product.price;
	}, 0);
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-10 bg-surface-100-800-token p-16">
		<h1 class="!leading-loose">View Order Products</h1>
		<div class="table-container">
			<table class="table table-hover">
				<thead>
					<tr>
						<th>Product ID</th>
						<th>Quantity</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>
					{#each products as product}
						<tr>
							<td>{product.product_id}</td>
							<td>{product.quantity}</td>
							<td>€{product.price}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<th colspan="2">Total Price</th>
						<td>€{totalPrice}</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
{/if}
