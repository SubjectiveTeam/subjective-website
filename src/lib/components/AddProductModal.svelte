<script lang="ts">
	import { enhance } from '$app/forms';
	import { FileDropzone, InputChip, SlideToggle, modalStore } from '@skeletonlabs/skeleton';
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-10 bg-surface-800 p-16">
		<h1 class="!leading-loose">Add Product</h1>
		<form class="flex flex-col gap-4" method="post" action="?/addProduct" use:enhance>
			<label class="label">
				<span>Name</span>
				<input class="input" type="text" placeholder="Name" name="name" required />
			</label>
			<label class="label">
				<span>Description</span>
				<input class="input" type="text" placeholder="Description" name="description" required />
			</label>
			<label class="label">
				<span>Price</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim hide-number-input-arrows">€</div>
					<input type="number" step="0.01" placeholder="Price" name="price" required />
				</div>
			</label>
			<label for="active">Active</label>
			<SlideToggle name="active" />
			<label for="sizes">Sizes</label>
			<InputChip
				name="sizes"
				label="Sizes"
				placeholder="Sizes"
				allowDuplicates={false}
				whitelist={['xl', 'l', 'm', 's']}
				required
			/>
			<label for="tags">Tags</label>
			<InputChip name="tags" placeholder="Tags" allowDuplicates={false} />
			<label for="images">Images</label>
			<FileDropzone name="images" required />
			<div class="flex gap-4 justify-between">
				<button class="btn variant-ringed-error" type="reset" on:click={() => modalStore.close()}
					>Cancel</button
				>
				<button class="btn variant-filled-secondary">Add Product</button>
			</div>
		</form>
	</div>
{/if}
