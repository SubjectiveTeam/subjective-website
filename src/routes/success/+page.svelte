<script>
	import { cartStore } from '$lib/stores/cart';
	import { onMount } from 'svelte';

	// Clear cart because checkout was successful
	onMount(() => {
		cartStore.clear();
	});
</script>

<h1 class="text-center !leading-loose">Successfully Placed Order.</h1>
<p class="text-center">
	Thank you for choosing Subjective. Track your order under Account &gt; Orders.
</p>
