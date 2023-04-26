<script lang="ts">
	import { page } from "$app/stores";
	import { Avatar } from "@skeletonlabs/skeleton";

	type NavigationItem = {
		name: string;
		href: string;
	}


	$page.data.supabase.auth.signInWithPassword({
      email: "hugokorteapple@gmail.com",
      password: "Kikker7543!"
    });

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
			<li><a href={href}>{name}</a></li>
		{/each}
		{#if !$page.data.session}
			<li><a href="/sign-in">Sign In</a></li>
			<li><a href="/sign-up">Sign Up</a></li>
		{:else}
			<Avatar initials={""} />
		{/if}
	</ul>
</nav>
