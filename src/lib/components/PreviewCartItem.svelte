<script lang="ts">
    import { cartStore } from "$lib/stores/cart";
    export let cartItem: CartItem;
</script>

<div class="flex justify-between items-center">
    <div class="flex flex-col">
        <p>{cartItem.product.name}</p>
        <p class="!text-[0.75rem] leading-0 opacity-75">Qt: {cartItem.quantity}</p>
    </div>
    <button class="btn btn-sm p-1 variant-filled-success" on:click={() => cartStore.add(cartItem.product)}>+</button>
    <button class="btn btn-sm p-1 variant-filled-error" on:click={() => cartStore.remove(cartItem.product)}>-</button>
</div>
