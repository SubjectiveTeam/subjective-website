<script lang="ts">
	import { drawerStore } from "@skeletonlabs/skeleton";
	import Navigation from "../../routes/Navigation.svelte";
</script>

{#if $drawerStore.id === 'sidebar'}
	<div class="mt-[var(--header-height)]">
		<Navigation orientation="vertical" />
	</div>
{/if}