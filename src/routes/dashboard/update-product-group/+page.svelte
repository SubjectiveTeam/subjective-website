<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { FileDropzone, toastStore } from '@skeletonlabs/skeleton';

	export let data;

	const { form, errors, constraints, enhance, tainted } = superForm(data.form, {
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

	let files: FileList;
	$: if (files) {
		if (!$tainted) $tainted = {};
		$tainted.files = true;
	}

	let working: boolean = false;
</script>

<h1 class="!leading-loose">Update Product Group</h1>
<section class="flex flex-col gap-10 card p-16">
	<form class="flex flex-col gap-16" method="post" use:enhance>
		<div class="flex flex-col gap-4">
			<label for="id" class="label">
				<span>ID</span>
				<input
					class="input"
					type="text"
					name="id"
					placeholder="ID"
					readonly
					disabled={working}
					data-invalid={$errors.id}
					bind:value={$form.id}
					{...$constraints.id}
				/>
			</label>
			{#if $errors.id}<span class="!text-error-500">{$errors.id}</span>{/if}
			<label for="name" class="label">
				<span>Name</span>
				<input
					class="input"
					type="text"
					name="name"
					placeholder="Name"
					disabled={working}
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
					disabled={working}
					data-invalid={$errors.description}
					bind:value={$form.description}
					{...$constraints.description}
				/>
			</label>
			{#if $errors.description}<span class="!text-error-500">{$errors.description}</span>{/if}
			<label for="files" class="label">
				<span>Images:</span>
				<FileDropzone name="files" bind:files={files} multiple disabled={working} />
			</label>
		</div>

		<div class="flex justify-end">
			<button
				disabled={working || !$tainted}
				class="btn variant-filled-secondary"
			>
				{#if working}
					Working...
				{:else}
					Update Product Group
				{/if}
			</button>
		</div>
	</form>
</section>
