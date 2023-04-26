<script lang="ts">
	import { drawerStore } from "@skeletonlabs/skeleton";
	import Navigation from "../../routes/Navigation.svelte";
</script>

{#if $drawerStore.id === 'sidebar'}
    <Navigation />
{/if}