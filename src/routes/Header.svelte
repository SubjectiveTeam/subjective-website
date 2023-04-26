<script lang="ts">
    import { AppBar } from "@skeletonlabs/skeleton";
    import { drawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";

    const toggleSideBar = () => {
        const drawerSettings: DrawerSettings = {
            id: 'sidebar',
            width: 'w-64',
            regionDrawer: 'p-4',
            position: 'left',
        }
        drawerStore.open(drawerSettings);
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
        <svg class="w-8 fill-token" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M432 928a48 48 0 1 1 0-96 48 48 0 0 1 0 96zm320 0a48 48 0 1 1 0-96 48 48 0 0 1 0 96zM96 128a32 32 0 0 1 0-64h160a32 32 0 0 1 31.36 25.728L320.64 256H928a32 32 0 0 1 31.296 38.72l-96 448A32 32 0 0 1 832 768H384a32 32 0 0 1-31.36-25.728L229.76 128H96zm314.24 576h395.904l82.304-384H333.44l76.8 384z"/></svg>
        <p class="!text-3xl">SBJCTV</p>
    </svelte:fragment>
</AppBar>