<script lang="ts">
	import { page } from '$app/stores';
	import { TabGroup, Tab, toastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	$: ({ orders } = data);

	const { form, constraints, errors, enhance } = superForm(data.form, {
		applyAction: true,
		invalidateAll: false,
		taintedMessage: false,
		resetForm: true,
		onResult({ result }) {
			if (result.type === 'success') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-success' });
			}
			if (result.type === 'failure') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-error' });
			}
		}
	});

	let tabSet: number = 0;
</script>

<section>
	<h1 class="!leading-loose">Account</h1>
	<TabGroup>
		<Tab bind:group={tabSet} name="personal-info" value={0}>Personal Info</Tab>
		<Tab bind:group={tabSet} name="my-orders" value={1}>My Orders</Tab>
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<div class="flex flex-col gap-8 max-w-lg">
					<label for="email" class="label">
						<span>Email:</span>
						<input
							class="input"
							type="email"
							name="email"
							readonly
							value={$page.data.session?.user.email}
						/>
					</label>
					<form class="flex flex-col gap-2" method="post" action="?/changePassword" use:enhance>
						<label for="password" class="label">
							<span>New Password:</span>
							<input
								class="input"
								type="password"
								placeholder="New Password"
								name="password"
								data-invalid={$errors.password}
								bind:value={$form.password}
								{...$constraints.password}
							/>
						</label>
						{#if $errors.password}<span class="!text-error-500">{$errors.password}</span>{/if}
						<label for="confirmPassword" class="label">
							<span>Confirm New Password:</span>
							<input
								class="input"
								type="password"
								placeholder="Confirm New Password"
								name="confirmPassword"
								data-invalid={$errors.confirmPassword}
								bind:value={$form.confirmPassword}
								{...$constraints.confirmPassword}
							/>
						</label>
						{#if $errors.confirmPassword}<span class="!text-error-500"
								>{$errors.confirmPassword}</span
							>{/if}
						<button class="btn variant-ringed-error max-w-lg">Change Password</button>
					</form>
					<form method="post" action="?/signOut">
						<button class="btn variant-filled-error w-fit">Sign Out</button>
					</form>
				</div>
			{:else if tabSet === 1}
				{#each orders as order}
					<p>{order.id}</p>
				{/each}
			{/if}
		</svelte:fragment>
	</TabGroup>
</section>
