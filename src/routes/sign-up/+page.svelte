<script lang="ts">
	import { faDiscord, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
	import { ProgressRadial, toastStore } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, constraints, errors, submitting, enhance, capture, restore } = superForm(
		data.form,
		{
			applyAction: true,
			invalidateAll: false,
			taintedMessage: false,
			onResult({ result }) {
				if (result.type === 'failure') {
					toastStore.trigger({ message: result.data?.message, background: 'variant-filled-error' });
				}
			}
		}
	);

	export const snapshot = { capture, restore };
</script>

<section class="flex flex-col xl:flex-row justify-evenly items-center gap-12 xl:mt-[12.5vh] w-full">
	<div class="flex flex-col items-center">
		<h1 class="h1 text-center !leading-loose">Sign Up</h1>
		<img class="hidden xl:block w-96 aspect-square" src="/SBJCTV-Logo.png" alt="logo" />
	</div>
	<div class="card shadow-xl px-6 py-12 flex flex-col gap-4 max-w-[25rem]">
		<form class="flex flex-col gap-2" method="post">
			<button
				class="btn variant-filled-secondary flex gap-2"
				formaction="/sign-in?/signIn&provider=google"
			>
				<Fa icon={faGoogle} />
				Sign up with Google
			</button>
			<button
				class="btn variant-filled-secondary flex gap-2"
				formaction="/sign-in?/signIn&provider=facebook"
			>
				<Fa icon={faFacebook} />
				Sign up with Facebook
			</button>
			<button
				class="btn variant-filled-secondary flex gap-2"
				formaction="/sign-in?/signIn&provider=discord"
			>
				<Fa icon={faDiscord} />
				Sign up with Discord
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
				type="text"
				name="email"
				data-invalid={$errors.email}
				bind:value={$form.email}
				{...$constraints.email}
			/>
			{#if $errors.email}<span class="!text-error-500">{$errors.email}</span>{/if}
			<input
				class="input"
				placeholder="Password"
				type="password"
				name="password"
				data-invalid={$errors.password}
				bind:value={$form.password}
				{...$constraints.password}
			/>
			{#if $errors.password}<span class="!text-error-500">{$errors.password}</span>{/if}
			<input
				class="input"
				placeholder="Confirm Password"
				type="password"
				name="confirmPassword"
				data-invalid={$errors.confirmPassword}
				bind:value={$form.confirmPassword}
				{...$constraints.confirmPassword}
			/>
			{#if $errors.confirmPassword}<span class="!text-error-500">{$errors.confirmPassword}</span
				>{/if}

			<button disabled={$submitting} class="btn variant-filled-primary">
				{#if $submitting}
					<span class="flex items-center gap-2">
						<ProgressRadial width="w-3" stroke={150} value={undefined} />
						Working...
					</span>
				{:else}
					Sign Up
				{/if}
			</button>
			<p class="text-center">
				Already have an account? <a class="anchor" href="/sign-in">Sign In</a> here.
			</p>
		</form>
	</div>
</section>
