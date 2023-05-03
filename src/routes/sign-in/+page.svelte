<script lang="ts">
	import { goto } from '$app/navigation';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, constraints, errors, enhance } = superForm(data.form, {
		applyAction: true,
		invalidateAll: false,
		taintedMessage: false,
		onResult({ result }) {
			if (result.type === 'redirect') {
				goto(result.location);
				toastStore.trigger({
					message: 'Succesfully signed in.',
					background: 'variant-filled-success'
				});
			}
			if (result.type === 'failure') {
				toastStore.trigger({ message: result.data?.message, background: 'variant-filled-error' });
			}
		}
	});
</script>

<section
	class="flex flex-col-reverse xl:flex-row justify-evenly items-center gap-12 xl:mt-[12.5vh] w-full"
>
	<div class="card shadow-xl px-6 py-12 flex flex-col gap-4 max-w-[25rem]">
		<form class="flex flex-col gap-2">
			<button class="btn variant-filled-secondary flex gap-2">
				<svg class="w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z"
						fill="#4285F4"
					/>
					<path
						d="M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z"
						fill="#34A853"
					/>
					<path
						d="M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z"
						fill="#FBBC05"
					/>
					<path
						d="M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z"
						fill="#EB4335"
					/>
				</svg>
				Sign in with Google
			</button>
			<button class="btn variant-filled-secondary flex gap-2">
				<svg
					class="w-7 h-8"
					viewBox="0 0 48 48"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
				>
					<title>Facebook-color</title>
					<desc>Created with Sketch.</desc>
					<defs />
					<g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0">
							<path
								d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z"
								id="Facebook"
							/>
						</g>
					</g>
				</svg>
				Sign in with Facebook
			</button>
			<button class="btn variant-filled-secondary flex gap-2">
				<svg class="w-7 h-7" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
					<circle cx="512" cy="512" r="512" style="fill:#5865f2" />
					<path
						d="M689.43 349a422.21 422.21 0 0 0-104.22-32.32 1.58 1.58 0 0 0-1.68.79 294.11 294.11 0 0 0-13 26.66 389.78 389.78 0 0 0-117.05 0 269.75 269.75 0 0 0-13.18-26.66 1.64 1.64 0 0 0-1.68-.79A421 421 0 0 0 334.44 349a1.49 1.49 0 0 0-.69.59c-66.37 99.17-84.55 195.9-75.63 291.41a1.76 1.76 0 0 0 .67 1.2 424.58 424.58 0 0 0 127.85 64.63 1.66 1.66 0 0 0 1.8-.59 303.45 303.45 0 0 0 26.15-42.54 1.62 1.62 0 0 0-.89-2.25 279.6 279.6 0 0 1-39.94-19 1.64 1.64 0 0 1-.16-2.72c2.68-2 5.37-4.1 7.93-6.22a1.58 1.58 0 0 1 1.65-.22c83.79 38.26 174.51 38.26 257.31 0a1.58 1.58 0 0 1 1.68.2c2.56 2.11 5.25 4.23 8 6.24a1.64 1.64 0 0 1-.14 2.72 262.37 262.37 0 0 1-40 19 1.63 1.63 0 0 0-.87 2.28 340.72 340.72 0 0 0 26.13 42.52 1.62 1.62 0 0 0 1.8.61 423.17 423.17 0 0 0 128-64.63 1.64 1.64 0 0 0 .67-1.18c10.68-110.44-17.88-206.38-75.7-291.42a1.3 1.3 0 0 0-.63-.63zM427.09 582.85c-25.23 0-46-23.16-46-51.6s20.38-51.6 46-51.6c25.83 0 46.42 23.36 46 51.6.02 28.44-20.37 51.6-46 51.6zm170.13 0c-25.23 0-46-23.16-46-51.6s20.38-51.6 46-51.6c25.83 0 46.42 23.36 46 51.6.01 28.44-20.17 51.6-46 51.6z"
						style="fill:#fff"
					/>
				</svg>
				Sign in with Discord
			</button>
		</form>
		<span class="flex items-center">
			<span class="h-0.5 w-full bg-surface-300-600-token" />
			<p class="px-2">or</p>
			<span class="h-0.5 w-full bg-surface-300-600-token" />
		</span>
		<form class="flex flex-col gap-4 max-w-lg" method="post" use:enhance>
			<input
				class="input"
				placeholder="Email"
				type="email"
				name="email"
				bind:value={$form.email}
				{...$constraints.email}
			/>
			{#if $errors.email}<span class="!text-error-500">{$errors.email}</span>{/if}
			<input
				class="input"
				placeholder="Password"
				type="password"
				name="password"
				bind:value={$form.password}
				{...$constraints.password}
			/>
			{#if $errors.password}<span class="!text-error-500">{$errors.password}</span>{/if}
			<button class="btn variant-filled-primary">Sign In</button>
			<p class="text-center">
				Don't have an account? Click <a href="/sign-up">here</a> to sign up.
			</p>
		</form>
	</div>
	<div class="flex flex-col items-center">
		<h1 class="text-center !leading-loose">Sign In</h1>
		<img class="hidden xl:block w-96 aspect-square" src="SBJCTV-Logo.png" alt="logo" />
	</div>
</section>
