<script lang="ts">
	import { FileDropzone, InputChip } from '@skeletonlabs/skeleton';
</script>

<form method="post" action="?/addProduct">
	<label class="label">
		<span>Name</span>
		<input class="input" type="text" placeholder="Name" name="name" />
	</label>
	<label class="label">
		<span>Description</span>
		<input class="input" type="text" placeholder="Description" name="description" />
	</label>
	<label class="label">
		<span>Price</span>
		<input class="input" type="number" placeholder="Price" name="price" />
	</label>
	<InputChip
		name="sizes"
		placeholder="Sizes"
		allowDuplicates={false}
		whitelist={['xl', 'm', 's', 'xs']}
	/>
	<InputChip name="tags" placeholder="Tags" allowDuplicates={false} />
	<FileDropzone name="images" />
	<button class="btn variant-filled-secondary">Add Product</button>
</form>
