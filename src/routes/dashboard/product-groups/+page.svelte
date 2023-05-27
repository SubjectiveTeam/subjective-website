<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let data;

	let refreshing = false;
	const refresh = async () => {
		refreshing = true;
		await invalidateAll();
		refreshing = false;
	};
</script>

<section class="flex flex-col gap-4">
	<div class="ml-auto">
		<button disabled={refreshing} class="btn btn-sm variant-filled-tertiary" on:click={refresh}>
			{#if refreshing}
				<span class="flex items-center gap-2">
					<ProgressRadial width="w-3" stroke={150} value={undefined} />
				</span>
			{:else}
				Refresh
			{/if}
		</button>
		<a
			class="btn btn-sm variant-filled-secondary"
			href="/dashboard/product-groups/add-product-group">Add Product Group</a
		>
	</div>
	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Description</th>
					<th>Images</th>
					<th>Edit</th>
				</tr>
			</thead>
			<tbody>
				{#each data.productGroups as productGroup, i}
					<tr>
						<td>{productGroup.id}</td>
						<td>{productGroup.name}</td>
						<td>{productGroup.description}</td>
						<td>{productGroup.images}</td>
						<td>
							<a
								class="btn btn-sm variant-filled-primary"
								href="/dashboard/product-groups/update-product-group?product_group_id={productGroup.id}"
								>Edit</a
							>
						</td>
					</tr>
				{:else}
					<p class="text-center p-4">No Product Groups</p>
				{/each}
			</tbody>
		</table>
	</div>
</section>
