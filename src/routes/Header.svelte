<script lang="ts">
    import { AppBar } from "@skeletonlabs/skeleton";
    import { drawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";

    const toggleSideBar = () => {
        const drawerSettings: DrawerSettings = {
            
        }
        drawerStore.open();
    }
</script>

<AppBar padding="py-4 px-8">
    <svelte:fragment slot="lead">
        <p class="hidden lg:inline">(logo)</p>
        <button class="lg:hidden btn" on:click={toggleSideBar}>
            <svg viewBox="0 0 24 24" class="fill-token w-6">
                <rect y="2" width="24" height="2" rx="2" ry="2"/>
                <rect y="10" width="24" height="2" rx="2" ry="2"/>
                <rect y="18" width="24" height="2" rx="2" ry="2"/>
            </svg>                  
        </button>
    </svelte:fragment>
    <svelte:fragment slot="trail"><p class="!text-2xl">SBJCTV</p></svelte:fragment>
</AppBar>