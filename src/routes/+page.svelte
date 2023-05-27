<script lang="ts">
	import Fa from 'svelte-fa';
	import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
</script>

<section class="flex flex-col xl:flex-row justify-between mt-[12.5vh] gap-48">
	<div class="flex-[50%] flex flex-col justify-between h-fit">
		<p class="!text-[clamp(2.5rem,3vw,3rem)] font-bold !leading-tight text-center xl:text-left">
			Subjective, Where great minds think <strike>alike</strike> differently.
		</p>
		<p class="mt-8 !leading-loose text-center xl:text-left">
			Subjective is an up and coming brand to change the fashion industry, are you tired of
			'following the trend'? Well we are! With Subjective you can be and express yourself.
		</p>
		<a
			class="unstyled btn variant-filled-secondary mt-8 w-fit text-center mx-auto xl:mx-[unset]"
			href="/clothing">Start Shopping</a
		>
	</div>
	<div class="flex-[50%] flex flex-col items-center">
		<p
			class="!text-[clamp(2.5rem,3vw,3rem)] font-bold !leading-tight xl:text-surface-50-900-token text-center"
		>
			Check out our newest collection
		</p>
		<img class="w-[25rem]" src="AmoreVince.png" alt="AmoreVince.png" />
		<a
			class="!text-white xl:!text-surface-50-900-token btn"
			href="/clothing?search=AmoreVince"
			aria-label="view-collection"
		>
			<Fa size="3x" class="fill-token" icon={faAngleDoubleRight} />
		</a>
	</div>
</section>
