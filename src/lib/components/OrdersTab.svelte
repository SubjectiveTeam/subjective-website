<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { modalStore, type ModalSettings, type ModalComponent } from "@skeletonlabs/skeleton";
	import ViewProductsModal from "$lib/components/modal/ViewProductsModal.svelte";

    export let orders: Order[];

    const triggerViewProductsModal = (order: Order) => {
        const modalComponent: ModalComponent = {
            ref: ViewProductsModal,
            props: { order }
        }
        const modal: ModalSettings = {
            type: 'component',
            component: modalComponent
        }
        modalStore.trigger(modal);
    }

    const triggerEditOrderModal = (order: Order) => {

    }

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
	{#if orders.length > 0}
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
					{#each orders as order, i}
						<tr>
							<td>{order.id}</td>
							<td>{order.address}</td>
							<td>{order.postal_code}</td>
							<td>{order.city}</td>
							<td>{order.customer_email}</td>
							<td>{order.status}</td>
							<td class="flex gap-4">
                                <button
                                class="btn btn-sm variant-filled-primary"
                                on:click={() => triggerViewProductsModal(order)}>View Products</button
                                >   
								<button
									class="btn btn-sm variant-filled-primary"
									on:click={() => triggerEditOrderModal(order)}>Edit</button
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
