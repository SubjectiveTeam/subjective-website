<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const signInCallBack: SubmitFunction = async () => {
		return async ({ result, update }) => {
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

<form action="?/signIn" method="post" use:enhance={signInCallBack}>
	<input class="input" placeholder="Email" type="text" name="email" />
	<input class="input" placeholder="Password" type="password" name="password" />
	<input class="input" placeholder="Confirm Password" type="password" name="confirmPassword" />
	<button class="btn variant-filled-secondary">Sign Up</button>
</form>
