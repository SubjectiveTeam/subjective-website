<script lang="ts">
	import Fa from 'svelte-fa';
	import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

	export let data;

	let carousalIndex = 0;

	const carousalPrevious = () => {
		if (carousalIndex <= 0) carousalIndex = data.productGroupDetailed.images.length - 1;
		else carousalIndex--;
	};

	const carousalNext = () => {
		if (carousalIndex >= data.productGroupDetailed.images.length - 1) carousalIndex = 0;
		else carousalIndex++;
	};
</script>

<div>
	<img
		src={data.productGroupDetailed.images[carousalIndex]}
		alt={data.productGroupDetailed.name}
		loading="lazy"
	/>
	<div class="flex justify-between">
		<button class="btn variant-filled-primary" on:click={carousalPrevious}>
			<Fa icon={faArrowLeft} />
		</button>
		<button class="btn variant-filled-primary" on:click={carousalNext}>
			<Fa icon={faArrowRight} />
		</button>
	</div>
</div>
