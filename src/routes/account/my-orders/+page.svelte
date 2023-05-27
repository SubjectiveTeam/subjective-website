<script lang="ts">
	export let data
</script>

<section class="flex flex-wrap gap-2">
	{#each data.ordersWithProducts as orderWithProducts}
		<div class="card p-4 flex flex-col gap-2">
			<header class="font-bold">Order ID: {orderWithProducts.id}</header>
			<p>Status: {orderWithProducts.status}</p>
			<hr />
			<section>
				<p class="font-bold">Products:</p>
				{#each orderWithProducts.order_products as order_product}
					<span>
						<p>ID: {order_product.id}</p>
						<p>Qt: {order_product.quantity}</p>
						<p>€ {order_product.price}</p>
					</span>
				{/each}
			</section>
			<hr />
			<footer>
				<p class="font-bold">Shipping Details:</p>
				<p>{orderWithProducts.city}</p>
				<p>{orderWithProducts.address}</p>
				<p>{orderWithProducts.postal_code}</p>
			</footer>
		</div>
	{/each}
</section>
