<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { modalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';
	import ViewOrderProductsModal from '$lib/components/modal/ViewProductsModal.svelte';

	export let ordersWithProducts: OrderWithProducts[];

	const triggerViewOrderProductsModal = (orderWithProducts: OrderWithProducts) => {
		const modalComponent: ModalComponent = {
			ref: ViewOrderProductsModal,
			props: { products: orderWithProducts.order_products }
		};
		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent
		};
		modalStore.trigger(modal);
	};

	let refreshingOrders: boolean = false;
	const refreshProducts = async () => {
		refreshingOrders = true;
		await invalidateAll();
		refreshingOrders = false;
	};
</script>

<section class="flex flex-col gap-4">
	<div class="ml-auto">
		<button
			disabled={refreshingOrders}
			class="btn btn-sm variant-filled-tertiary"
			on:click={refreshProducts}
		>
			{#if refreshingOrders}
				Working...
			{:else}
				Refresh
			{/if}
		</button>
	</div>
	{#if ordersWithProducts.length > 0}
		<div class="table-container">
			<table class="table table-hover">
				<thead>
					<tr>
						<th>ID</th>
						<th>Address</th>
						<th>Postal Code</th>
						<th>City</th>
						<th>Customer Email</th>
						<th>Status</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#each ordersWithProducts as orderWithProducts}
						<tr>
							<td>{orderWithProducts.id}</td>
							<td>{orderWithProducts.address}</td>
							<td>{orderWithProducts.postal_code}</td>
							<td>{orderWithProducts.city}</td>
							<td>{orderWithProducts.customer_email}</td>
							<td>{orderWithProducts.status}</td>
							<td class="flex gap-4">
								<button
									class="btn btn-sm variant-filled-primary"
									on:click={() => triggerViewOrderProductsModal(orderWithProducts)}
									>View Products</button
								>
								<a
									href="dashboard/update-order?order_id={orderWithProducts.id}"
									class="btn btn-sm variant-filled-primary">Edit</a
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="text-center">No Orders</p>
	{/if}
</section>
