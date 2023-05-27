<script lang="ts">
	import { page } from '$app/stores';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
</script>

<section class="mb-4">
	<h1 class="h1 !leading-loose">Account</h1>
	<TabGroup>
		<a href="/account/personal-info">
			<Tab bind:group={$page.url.pathname} name="personal-info" value={'/account/personal-info'}
				>Personal Info</Tab
			>
		</a>
		<a href="/account/my-orders">
			<Tab bind:group={$page.url.pathname} name="my-orders" value={'/account/my-orders'}
				>My Orders</Tab
			>
		</a>
	</TabGroup>
</section>

<slot />
