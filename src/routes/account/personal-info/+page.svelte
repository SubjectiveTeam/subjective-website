<script lang="ts">
	import { page } from '$app/stores';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, constraints, errors, enhance, capture, restore } = superForm(data.form, {
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

	export const snapshot = { capture, restore };
</script>

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
		{#if $errors.confirmPassword}<span class="!text-error-500">{$errors.confirmPassword}</span>{/if}
		<button class="btn variant-ringed-error max-w-lg">Change Password</button>
	</form>
	<form method="post" action="?/signOut">
		<button class="btn variant-filled-error w-fit">Sign Out</button>
	</form>
</div>
