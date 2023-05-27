<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import {
		modalStore,
		type ModalSettings,
		type ModalComponent,
		ProgressRadial
	} from '@skeletonlabs/skeleton';
	import ViewOrderProductsModal from '$lib/components/modal/ViewProductsModal.svelte';

	export let data;

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

	let refreshing = false;
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
				<span class="flex items-center gap-2">
					<ProgressRadial width="w-3" stroke={150} value={undefined} />
					Working...
				</span>
			{:else}
				Refresh
			{/if}
		</button>
	</div>
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
					<th>Edit</th>
				</tr>
			</thead>
			<tbody>
				{#each data.ordersWithProducts as orderWithProducts}
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
								href="/dashboard/orders/update-order?order_id={orderWithProducts.id}"
								class="btn btn-sm variant-filled-primary">Edit</a
							>
						</td>
					</tr>
				{:else}
					<p class="text-center p-4">No Orders</p>
				{/each}
			</tbody>
		</table>
	</div>
</section>
