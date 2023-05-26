<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	const getIncrement = (number: number) => {
		if (number >= 0 && number < 0.2) return 0.1;
		else if (number >= 0.2 && number < 0.5) return 0.04;
		else if (number >= 0.5 && number < 0.8) return 0.02;
		else if (number >= 0.8 && number < 0.99) return 0.005;
		return 0;
	};

	let width = 0;
	let running = false;
	let updater: undefined | ReturnType<typeof setInterval>;
	let completed = false;

	const minimum = 0.08;
	const maximum = 0.994;
	const settleTime = 700;
	const intervalTime = 700;
	const stepSizes: number[] = [0, 0.005, 0.01, 0.02];

	export const reset = () => {
		width = minimum;
		running = true;
	};

	export const animate = () => {
		if (updater) {
			// prevent multiple intervals by clearing before making
			clearInterval(updater);
		}
		running = true;
		updater = setInterval(() => {
			const randomStep = stepSizes[Math.floor(Math.random() * stepSizes.length)];
			const step = getIncrement(width) + randomStep;
			if (width < maximum) {
				width = width + step;
			}
			if (width > maximum) {
				width = maximum;
				stop();
			}
		}, intervalTime);
	};

	export const start = () => {
		reset();
		animate();
	};

	export const stop = () => {
		if (updater) {
			clearInterval(updater);
		}
	};

	export const complete = () => {
		clearInterval(updater);
		width = 1;
		running = false;
		setTimeout(() => {
			completed = true;
			setTimeout(() => {
				completed = false;
				width = 0;
			}, settleTime);
		}, settleTime);
	};

	export const setWidthRatio = (widthRatio: number) => {
		stop();
		width = widthRatio;
		completed = false;
		running = true;
	};

	let barStyle: string = (width && width * 100 && `width: ${width * 100}%;`) || '';
	$: barStyle = (width && width * 100 && `width: ${width * 100}%;`) || '';
</script>

{#if width}
	{#if !completed}
		<div
			class="variant-filled-primary fixed top-0 left-0 h-[2px] transition-[width] duration-[210ms] z-[1]"
			class:running
			style={barStyle}
			out:fly={{ y: -8, duration: 800, easing: cubicOut }}
		>
			{#if running}
				<div
					class="variant-filled-primary absolute top-0 right-0 h-[3px] w-[100px] rotate-[2.5deg] -translate-y-[4px] shadow-[0_0_8px] z-[2]"
				/>
			{/if}
		</div>
	{/if}
{/if}
