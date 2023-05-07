<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { toastStore, FileDropzone } from '@skeletonlabs/skeleton';

	export let data;

	const { form, errors, constraints, enhance } = superForm(data.form, {
		applyAction: true,
		onSubmit() {
			working = true;
		},
		onResult({ result }) {
			if (result.type === 'success') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-success' });
			} else if (result.type === 'failure') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-error' });
				working = false;
			}
		}
	});
	
	let working: boolean = false;
</script>

<h1 class="!leading-loose">Add Product Group</h1>
<section class="flex flex-col gap-10 card p-16">
	<form class="flex flex-col gap-16" method="post" use:enhance>
		<div class="flex flex-col gap-4">
			<label for="name" class="label">
				<span>Name</span>
				<input
					class="input"
					type="text"
					name="name"
					placeholder="Name"
					data-invalid={$errors.name}
					bind:value={$form.name}
					{...$constraints.name}
				/>
			</label>
			{#if $errors.name}<span class="!text-error-500">{$errors.name}</span>{/if}
			<label for="description" class="label">
				<span>Description</span>
				<textarea
					class="input resize-none"
					name="description"
					placeholder="Description"
					data-invalid={$errors.description}
					bind:value={$form.description}
					{...$constraints.description}
				/>
			</label>
			{#if $errors.description}<span class="!text-error-500">{$errors.description}</span>{/if}
			<label for="files" class="label">
				<span>Images:</span>
				<FileDropzone name="files" required multiple />
			</label>
		</div>

		<div class="flex justify-end">
			<button disabled={working} class="btn variant-filled-secondary">
				{#if working}
					Working...
				{:else}
					Add Product Group
				{/if}
			</button>
		</div>
	</form>
</section>
