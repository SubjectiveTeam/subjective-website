<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let order: Order;

	const fetchOrderProducts = async () => {
		const fetchOrderProducts = await fetch(
			`https://jkcymtlnxiygulxfzgbf.supabase.co/rest/v1/order_products?order_id=eq.${order.id}&select=*`,
			{
				headers: {
					apikey: `${PUBLIC_SUPABASE_ANON_KEY}`,
					Authorization: `Bearer ${$page.data.session?.access_token}`
				}
			}
		);
		if (!fetchOrderProducts.ok) return fetchOrderProducts.text();
		return await fetchOrderProducts.json();
	};

	const promise = fetchOrderProducts();
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-10 bg-surface-100-800-token p-16">
		<h1 class="!leading-loose">View Order Products</h1>
		{#await promise}
			<p>Loading...</p>
		{:then orderProductsList}
			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Product ID</th>
							<th>Quantity</th>
							<th>Size</th>
						</tr>
					</thead>
					<tbody>
						{#each orderProductsList as orderProducts}
							<tr>
								<td>{orderProducts.order_id}</td>
								<td>{orderProducts.product_id}</td>
								<td>{orderProducts.quantity}</td>
								<td>{orderProducts.size}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:catch error}
			<p class="text-red">{error.message}</p>
		{/await}
	</div>
{/if}
