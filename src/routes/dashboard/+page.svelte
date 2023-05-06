<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import ProductsTab from '$lib/components/ProductsTab.svelte';
	import OrdersTab from '$lib/components/OrdersTab.svelte';
	import AnalyticsTab from '$lib/components/AnalyticsTab.svelte';
	import PromotionCodesTab from '$lib/components/PromotionCodesTab.svelte';

	export let data;

	let tabSet: number = 0;
</script>

<section>
	<h1 class="!leading-loose">Dashboard</h1>
	<TabGroup>
		<Tab bind:group={tabSet} name="products" value={0}>Products</Tab>
		<Tab bind:group={tabSet} name="orders" value={1}>Orders</Tab>
		<Tab bind:group={tabSet} name="analytics" value={2}>Analytics</Tab>
		<Tab bind:group={tabSet} name="promotion-codes" value={3}>Promotion Codes</Tab>

		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<ProductsTab products={data.products} />
			{:else if tabSet === 1}
				<OrdersTab ordersWithProducts={data.order_products} />
			{:else if tabSet === 2}
				<AnalyticsTab />
			{:else if tabSet === 3}
				<PromotionCodesTab />
			{/if}
		</svelte:fragment>
	</TabGroup>
</section>
