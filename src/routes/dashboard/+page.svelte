<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import ProductsTab from '$components/dashboard-tabs/ProductsTab.svelte';
	import ProductGroupsTab from '$lib/components/dashboard-tabs/ProductGroupsTab.svelte';
	import OrdersTab from '$lib/components/dashboard-tabs/OrdersTab.svelte';
	import AnalyticsTab from '$lib/components/dashboard-tabs/AnalyticsTab.svelte';
	import PromotionCodesTab from '$lib/components/dashboard-tabs/PromotionCodesTab.svelte';

	export let data;

	let tabSet: number = 0;
</script>

<section>
	<h1 class="h1 !leading-loose">Dashboard</h1>
	<TabGroup>
		<Tab bind:group={tabSet} name="products" value={0}>Products</Tab>
		<Tab bind:group={tabSet} name="product-groups" value={1}>Product Groups</Tab>
		<Tab bind:group={tabSet} name="orders" value={2}>Orders</Tab>
		<Tab bind:group={tabSet} name="analytics" value={3}>Analytics</Tab>
		<Tab bind:group={tabSet} name="promotion-codes" value={4}>Promotion Codes</Tab>

		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<ProductsTab products={data.products} />
			{:else if tabSet === 1}
				<ProductGroupsTab productGroups={data.productGroups} />
			{:else if tabSet === 2}
				<OrdersTab ordersWithProducts={data.orderProducts} />
			{:else if tabSet === 3}
				<AnalyticsTab />
			{:else if tabSet === 4}
				<PromotionCodesTab />
			{/if}
		</svelte:fragment>
	</TabGroup>
</section>
