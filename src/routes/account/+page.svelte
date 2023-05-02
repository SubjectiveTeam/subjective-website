<script lang="ts">
	import { page } from '$app/stores';
	import NewPasswordModal from '$lib/components/modal/NewPasswordModal.svelte';
	import {
		TabGroup,
		Tab,
		modalStore,
		type ModalSettings,
		type ModalComponent
	} from '@skeletonlabs/skeleton';

	export let data;

	$: ({ orders } = data);

	const triggerNewPasswordModal = () => {
		const ModalComponent: ModalComponent = {
			ref: NewPasswordModal
		};
		const modal: ModalSettings = {
			type: 'component',
			component: ModalComponent
		};
		modalStore.trigger(modal);
	};

	let tabSet: number = 0;
</script>

<section>
	<h1 class="!leading-loose">Account</h1>
	<TabGroup>
		<Tab bind:group={tabSet} name="personal-info" value={0}>Personal Info</Tab>
		<Tab bind:group={tabSet} name="my-orders" value={1}>My Orders</Tab>
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<form class="flex flex-col gap-4" method="post">
					<label class="label max-w-lg">
						<span>Email:</span>
						<input type="text" class="input" disabled value={$page.data.session?.user.email} />
					</label>
					<button class="btn variant-ringed-error w-fit" on:click={triggerNewPasswordModal}
						>Change Password</button
					>
					<button class="btn variant-filled-error w-fit" formaction="?/signOut">Sign Out</button>
				</form>
			{:else if tabSet === 1}
				{#each orders as order}
					<p>{order.id}</p>
				{/each}
			{/if}
		</svelte:fragment>
	</TabGroup>
</section>
