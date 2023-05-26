<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
</script>

<section class="mb-4">
	<h1 class="h1 !leading-loose">Dashboard</h1>
	<TabGroup>
		<a href="/dashboard/products">
			<Tab bind:group={$page.url.pathname} name="products" value={'/dashboard/products'}
				>Products</Tab
			>
		</a>
		<a href="/dashboard/product-groups">
			<Tab bind:group={$page.url.pathname} name="product-groups" value={'/dashboard/product-groups'}
				>Product Groups</Tab
			>
		</a>
		<a href="/dashboard/orders">
			<Tab bind:group={$page.url.pathname} name="orders" value={'/dashboard/orders'}>Orders</Tab>
		</a>
		<a href="/dashboard/analytics">
			<Tab bind:group={$page.url.pathname} name="analytics" value={'/dashboard/analytics'}
				>Analytics</Tab
			>
		</a>
		<a href="/dashboard/promotion-codes">
			<Tab
				bind:group={$page.url.pathname}
				name="promotion-codes"
				value={'/dashboard/promotion-codes'}>Promotion Codes</Tab
			>
		</a>
	</TabGroup>
</section>

<slot />
