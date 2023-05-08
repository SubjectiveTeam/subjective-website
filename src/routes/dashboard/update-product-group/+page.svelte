<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { FileDropzone, toastStore } from '@skeletonlabs/skeleton';

	export let data;

	const { form, errors, constraints, enhance, submitting, tainted } = superForm(data.form, {
		applyAction: true,
		onResult({ result }) {
			if (result.type === 'success') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-success' });
			} else if (result.type === 'failure') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-error' });
			}
		}
	});

	let files: FileList;
	$: if (files) {
		if (!$tainted) $tainted = {};
		$tainted.files = true;
	}
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
					disabled={$submitting}
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
					disabled={$submitting}
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
					disabled={$submitting}
					data-invalid={$errors.description}
					bind:value={$form.description}
					{...$constraints.description}
				/>
			</label>
			{#if $errors.description}<span class="!text-error-500">{$errors.description}</span>{/if}
			<label for="files" class="label">
				<span>Images:</span>
				<FileDropzone name="files" bind:files multiple disabled={$submitting} />
				{#if files}
					<ul class="flex gap-4">
						{#each Array.from(files) as file}
							<li class="chip variant-filled-tertiary">{file.name}</li>
						{/each}
					</ul>
				{/if}
			</label>
		</div>

		<div class="flex justify-end">
			<button disabled={$submitting || !$tainted} class="btn variant-filled-secondary">
				{#if $submitting}
					Working...
				{:else}
					Update Product Group
				{/if}
			</button>
		</div>
	</form>
</section>
