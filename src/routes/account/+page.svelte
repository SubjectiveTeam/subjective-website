<script lang="ts">
	import OrdersTab from '$components/account-tabs/OrdersTab.svelte';
	import PersonalInfoTab from '$components/account-tabs/PersonalInfoTab.svelte';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';

	export let data;

	let tabSet: number = 0;
</script>

<section>
	<h1 class="h1 !leading-loose">Account</h1>
	<TabGroup>
		<Tab bind:group={tabSet} name="personal-info" value={0}>Personal Info</Tab>
		<Tab bind:group={tabSet} name="my-orders" value={1}>My Orders</Tab>
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<PersonalInfoTab data={data.form} />
			{:else if tabSet === 1}
				<OrdersTab ordersWithProducts={data.ordersWithProducts} />
			{/if}
		</svelte:fragment>
	</TabGroup>
</section>
