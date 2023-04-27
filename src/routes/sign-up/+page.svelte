<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const signInCallBack: SubmitFunction = async () => {
		return async ({ result }) => {
			await applyAction(result);
			let toastSettings: ToastSettings;
			if (result.type === 'redirect') {
				toastSettings = {
					message: 'Successfully signed up, confirm your email please.',
					background: 'variant-filled-sucesss'
				};
			} else {
				toastSettings = {
					message: result.data.message,
					background: 'variant-filled-error'
				};
			}
			toastStore.trigger(toastSettings);
		};
	};
</script>

<section class="card shadow-xl px-6 py-12 mx-auto flex w-fit flex-col gap-10 mt-[12.5vh]">
	<h1 class="text-center !leading-relaxed">Sign Up</h1>
	<form class="flex flex-col gap-4 max-w-lg" method="post" use:enhance={signInCallBack}>
		<input class="input" placeholder="Email" type="text" name="email"/>
		<input class="input" placeholder="Password" type="password" name="password" />
		<input class="input" placeholder="Confirm Password" type="password" name="confirmPassword" />
		<p class="text-center mt-4">Already have an account? Click <a href="/sign-up">here</a> to sign in.</p>
		<button class="btn variant-filled-secondary mt-4">Sign Up</button>
	</form>
</section>
