<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import {
		modalStore,
		toastStore,
		type PopupSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';

	export let order: Order;

	const updateOrderCallback: SubmitFunction = () => {
		updating = true;
		return async ({ result }) => {
			await applyAction(result);
			if (result.type === 'success') {
				await invalidateAll();
				modalStore.close();
				const toast: ToastSettings = {
					message: 'Successfully updated order.',
					background: 'variant-filled-success'
				};
				toastStore.trigger(toast);
			} else if (result.type === 'failure') {
				const toast: ToastSettings = {
					message: result.data?.message,
					background: 'variant-filled-error'
				};
				toastStore.trigger(toast);
			}
			updating = false;
		};
	};

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'combobox',
		placement: 'bottom',
		// Close the popup when the item is clicked
		closeQuery: '.listbox-item'
	};

	let updating: boolean = false;
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-10 bg-surface-100-800-token p-16">
		<h1 class="!leading-loose">Edit Order</h1>
		<form
			class="flex flex-col gap-4"
			action="?/updateOrder"
			method="post"
			use:enhance={updateOrderCallback}
		>
			<label class="label">
				<span>ID</span>
				<input
					class="input"
					type="text"
					placeholder="ID"
					name="id"
					required
					readonly
					bind:value={order.id}
				/>
			</label>
			<label class="label">
				<span>Address</span>
				<input
					class="input"
					type="text"
					placeholder="Address"
					name="address"
					required
					bind:value={order.address}
				/>
			</label>
			<label class="label">
				<span>Postal Code</span>
				<input
					class="input"
					type="text"
					placeholder="Postal Code"
					name="postal-code"
					required
					bind:value={order.postal_code}
				/>
			</label>
			<label class="label">
				<span>City</span>
				<input
					class="input"
					type="text"
					placeholder="City"
					name="city"
					required
					bind:value={order.city}
				/>
			</label>

			<label class="label flex flex-col relative">
				<span>Status</span>
			</label>

			<div class="flex gap-4 mt-8 justify-between">
				<button class="btn variant-ringed-error" type="reset" on:click={() => modalStore.close()}
					>Cancel</button
				>
				<button disabled={updating} class="btn variant-filled-secondary">
					{#if updating}
						Working...
					{:else}
						Update Order
					{/if}
				</button>
			</div>
		</form>
	</div>
{/if}
