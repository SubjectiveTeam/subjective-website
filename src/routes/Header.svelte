<script lang="ts">
    import { AppBar, popup, type PopupSettings } from "@skeletonlabs/skeleton";
    import { drawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";
    import { cartStore } from "$lib/stores/cart";
	import PreviewCartItem from "$lib/components/PreviewCartItem.svelte";

    const toggleSideBar = () => {
        const drawerSettings: DrawerSettings = {
            id: 'sidebar',
            width: 'w-64',
            regionDrawer: 'p-4',
            position: 'left',
        }
        drawerStore.open(drawerSettings);
    }

    const cartMenuPopupSettings: PopupSettings = {
        event: 'click',
        target: 'cart-menu',
        closeQuery: '*:not(*)'
    }

    let totalPrice = 0;
    $: {
        let result = 0;
        [...$cartStore.values()].forEach(cartItem => {
            result += cartItem.product.price * cartItem.quantity;
        });
        totalPrice = result;
    }
</script>

<AppBar padding="py-4 px-8">
    <svelte:fragment slot="lead">
        <p class="hidden lg:inline">(logo)</p>
        <button class="lg:hidden btn" on:click={toggleSideBar}>
            <svg viewBox="0 0 100 100" class="fill-token w-8">
                <rect x="10" y="20" width="80" height="10" rx="2" />
                <rect x="10" y="45" width="80" height="10" rx="2" />
                <rect x="10" y="70" width="80" height="10" rx="2" />
              </svg>            
        </button>
    </svelte:fragment>
    <svelte:fragment slot="trail">
        <button class="btn" use:popup={cartMenuPopupSettings}>
            <svg class="w-8 fill-token" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M432 928a48 48 0 1 1 0-96 48 48 0 0 1 0 96zm320 0a48 48 0 1 1 0-96 48 48 0 0 1 0 96zM96 128a32 32 0 0 1 0-64h160a32 32 0 0 1 31.36 25.728L320.64 256H928a32 32 0 0 1 31.296 38.72l-96 448A32 32 0 0 1 832 768H384a32 32 0 0 1-31.36-25.728L229.76 128H96zm314.24 576h395.904l82.304-384H333.44l76.8 384z"/></svg>
        </button>
        <div class="card p-4 w-64" data-popup="cart-menu">
            <ul class="flex flex-col gap-2 h-48 overflow-scroll">
                {#each [...$cartStore.values()] as cartItem}
                    <PreviewCartItem cartItem={cartItem} />
                {:else}
                    <p>You're shopping cart is empty</p>
                {/each}
            </ul> 
            <hr />
            <div class="mt-4 flex flex-col gap-2">
                <p>Total: ${totalPrice}</p>
                <div class="flex justify-between">
                    <span class="{$cartStore.size===0 ? "cursor-not-allowed" : ""}">
                        <a class="{$cartStore.size===0 ? "opacity-50 pointer-events-none" : ""} btn variant-ringed-primary" href="/checkout">Checkout</a>
                    </span>
                    <button disabled={$cartStore.size===0} class="btn p-2 variant-filled-error" on:click={() => cartStore.clear()}>
                        <svg class="h-6 w-6 fill-token" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 	 viewBox="0 0 492.308 492.308" xml:space="preserve"><g>	<g>					<rect x="151.852" y="163.175" transform="matrix(0.9971 -0.0764 0.0764 0.9971 -21.7697 13.2064)" width="19.692" height="255.833"/>	</g></g><g>	<g>		<rect x="236.308" y="163.545" width="19.692" height="255.084"/>	</g></g><g>	<g>					<rect x="202.697" y="281.247" transform="matrix(0.0762 -0.9971 0.9971 0.0762 15.1818 598.5728)" width="255.831" height="19.692"/>	</g></g><g>	<g>		<path d="M448.627,70.115h-51.173V27.577C397.454,12.375,385.089,0,369.887,0H122.416c-15.202,0-27.567,12.375-27.567,27.577			v42.538H43.675H14.752v19.692h31.363L91.06,452.51c2.813,22.692,22.178,39.798,45.043,39.798H356.2			c22.865,0,42.231-17.106,45.043-39.798l44.945-362.702h31.368V70.115H448.627z M114.541,27.577c0-4.346,3.534-7.885,7.875-7.885			h247.471c4.341,0,7.875,3.538,7.875,7.885v42.538H114.541V27.577z M381.704,450.087c-1.596,12.846-12.558,22.529-25.505,22.529			H136.103c-12.947,0-23.909-9.683-25.505-22.529L65.954,89.808h28.894h302.606h28.894L381.704,450.087z"/>	</g></g></svg>
                    </button>
                </div>
            </div>
        </div>
        <p class="!text-3xl">SBJCTV</p>
    </svelte:fragment>
</AppBar>