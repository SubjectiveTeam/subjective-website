<script>
	import { FileDropzone, InputChip, modalStore } from "@skeletonlabs/skeleton";
</script>

{#if $modalStore[0]}
    <div class="flex flex-col gap-10 bg-surface-800 p-16">
        <h1 class="!leading-loose">Add Product</h1>
        <form class="flex flex-col gap-4" method="post" action="?/addProduct">
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
                    <input type="number" placeholder="Price" name="price" required />
                </div>
            </label>
            <InputChip
                name="sizes"
                label="Sizes"
                placeholder="Sizes"
                allowDuplicates={false}
                whitelist={['xl', 'l', 'm', 's']}
                required
            />
            <InputChip name="tags" placeholder="Tags" allowDuplicates={false} />
            <FileDropzone name="images" required />
            <button class="btn variant-filled-secondary">Add Product</button>
        </form>
    </div>
{/if}