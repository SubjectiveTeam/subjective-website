<script lang="ts">
	import { page } from "$app/stores";
	import { drawerStore } from "@skeletonlabs/skeleton";

	type NavigationItem = {
		name: string;
		href: string;
	}

	const navItems: NavigationItem[] = [
		{	
			name: 'Home',
			href : '/'
		},
		{	
			name: 'Clothing',
			href : '/shop'
		},
		{	
			name: 'About',
			href : '/about'
		}
	];
</script>

<nav class="list-nav">
	<ul>
		{#each navItems as {name, href}} 
			<li><a on:click={() => drawerStore.close()} href={href}>{name}</a></li>
		{/each}
		{#if !$page.data.session}
			<li><a on:click={() => drawerStore.close()} href="/sign-in">Sign In</a></li>
			<li><a on:click={() => drawerStore.close()} href="/sign-up">Sign Up</a></li>
		{:else}
			<li class="mt-auto"><a on:click={() => drawerStore.close()} href="/account">Account</a></li>
		{/if}
	</ul>
</nav>
