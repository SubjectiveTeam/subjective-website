<script lang="ts">
	import AddProductModal from '$lib/components/AddProductModal.svelte';
	import { Tab, TabGroup, type ModalComponent, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

    export let data: PageData;

    $: ({ products } = data);

	let tabSet: number = 0;
    const triggerNewPasswordModal = () => {
		const ModalComponent: ModalComponent = {
			ref: AddProductModal
		};
		const modal: ModalSettings = {
			type: 'component',
			component: ModalComponent
		};
		modalStore.trigger(modal);
	};
</script>

<section>
	<h1 class="!leading-loose">Dashboard</h1>
    <TabGroup>
        <Tab bind:group={tabSet} name="products" value={0}>Products</Tab>
        <Tab bind:group={tabSet} name="orders" value={1}>Orders</Tab>
        <Tab bind:group={tabSet} name="analytics" value={2}>Analytics</Tab>
    
        <svelte:fragment slot="panel">
            {#if tabSet === 0}
                <section class="flex flex-col gap-4 items-end">
                    <button class="btn !btn-sm variant-filled-secondary" on:click={triggerNewPasswordModal}>Add Product</button>
                    <div class="table-container">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Stripe_ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Sizes</th>
                                    <th>Tags</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each products as product, i}
                                    <tr>
                                        <td>{product.id}</td>
                                        <td>{product.stripe_id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>{product.price}</td>
                                        <td>{product.sizes}</td>
                                        <td>{product.tags}</td>
                                    </tr>
                                {/each}
                            </tbody>
                            <!-- <tfoot>
                                <tr>
                                    <th colspan="3">Calculated Total Weight</th>
                                    <td>{totalWeight}</td>
                                </tr>
                            </tfoot> -->
                        </table>
                    </div>
                </section>
            {:else if tabSet === 1}
                (Orders)
            {:else if tabSet === 2}
                (Analyitics)
            {/if}
        </svelte:fragment>
    </TabGroup>
</section>



