<script lang="ts">
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
			<li><a href={href}>{name}</a></li>
		{/each}
	</ul>
</nav>
