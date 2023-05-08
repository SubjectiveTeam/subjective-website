<script lang="ts">
	import {
		ListBox,
		ListBoxItem,
		popup,
		toastStore,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, constraints, errors, enhance, submitting, tainted } = superForm(data.form, {
		applyAction: true,
		onResult({ result }) {
			if (result.type === 'success') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-success' });
			} else if (result.type === 'failure') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-error' });
			}
		}
	});

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'combobox',
		placement: 'bottom',
		// Close the popup when the item is clicked
		closeQuery: '.listbox-item'
	};

</script>

<h1 class="!leading-loose">Update Order</h1>
<section class="flex flex-col gap-10 card p-16">
	<form class="flex flex-col gap-16" method="post" use:enhance>
		<div class="flex flex-col md:flex-row gap-4">
			<div class="flex-1 flex flex-col gap-4">
				<label for="id" class="label">
					<span>ID</span>
					<input
						class="input"
						type="text"
						name="id"
						placeholder="ID"
						readonly
						disabled={$submitting}
						data-invalid={$errors.id}
						bind:value={$form.id}
						{...$constraints.id}
					/>
				</label>
				{#if $errors.id}<span class="!text-error-500">{$errors.id}</span>{/if}
				<label for="address" class="label">
					<span>Address</span>
					<input
						class="input"
						type="text"
						name="address"
						placeholder="Address"
						disabled={$submitting}
						data-invalid={$errors.address}
						bind:value={$form.address}
						{...$constraints.address}
					/>
				</label>
				{#if $errors.address}<span class="!text-error-500">{$errors.address}</span>{/if}
				<label for="postal_code" class="label">
					<span>Postal Code</span>
					<input
						class="input"
						type="text"
						name="postal_code"
						placeholder="Postal Code"
						disabled={$submitting}
						data-invalid={$errors.postal_code}
						bind:value={$form.postal_code}
						{...$constraints.postal_code}
					/>
				</label>
				{#if $errors.postal_code}<span class="!text-error-500">{$errors.postal_code}</span>{/if}
				<label for="city" class="label">
					<span>City</span>
					<input
						class="input"
						type="text"
						name="city"
						placeholder="city"
						disabled={$submitting}
						data-invalid={$errors.city}
						bind:value={$form.city}
						{...$constraints.city}
					/>
				</label>
				{#if $errors.city}<span class="!text-error-500">{$errors.city}</span>{/if}
			</div>
			<div class="flex-1 flex flex-col gap-4">
				<label for="status" class="label">
					<span>Status</span>
					<button type="button" class="btn input" use:popup={popupCombobox}>
						{$form.status}
					</button>
					<div class="card w-48 shadow-xl py-2" data-popup="combobox">
						<ListBox
							rounded="rounded-none"
							{...$constraints.status}
							data-invalid={$errors.status}
							disabled={$submitting}
						>
							<ListBoxItem bind:group={$form.status} name="status" value="ORDERED">
								ORDERED
							</ListBoxItem>
							<ListBoxItem bind:group={$form.status} name="status" value="PROCESSED">
								PROCESSED
							</ListBoxItem>
							<ListBoxItem bind:group={$form.status} name="status" value="SHIPPED">
								SHIPPED
							</ListBoxItem>
							<ListBoxItem bind:group={$form.status} name="status" value="DELIVERED">
								DELIVERED
							</ListBoxItem>
							<ListBoxItem bind:group={$form.status} name="status" value="CANCELED">
								CANCELED
							</ListBoxItem>
						</ListBox>
						<div class="arrow bg-surface-100-800-token" />
					</div>
				</label>
				{#if $errors.status}<span class="!text-error-500">{$errors.status}</span>{/if}
			</div>
		</div>

		<div class="flex justify-end">
			<button disabled={$submitting || !$tainted} class="btn variant-filled-secondary">
				{#if $submitting}
					Working...
				{:else}
					Update Order
				{/if}
			</button>
		</div>
	</form>
</section>
