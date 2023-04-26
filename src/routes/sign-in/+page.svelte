<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';

	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const signInCallBack: SubmitFunction = async () => {
		return async ({ result, update }) => {
			let toastSettings: ToastSettings;
			console.log(result);
			if (result.type === 'redirect') {
				toastSettings = {
					message: 'Successfully signed in.',
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
	<input class="input" placeholder="Email" type="text" />
	<input class="input" placeholder="Password" type="password" />
	<button class="btn variant-filled-secondary">Sign In</button>
</form>
