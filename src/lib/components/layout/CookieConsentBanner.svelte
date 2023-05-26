<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	const acceptConsentCookie = {
		essential: true,
		functional: true,
		analytics: true,
		preferences: true
	};
	const rejectConsentCookie = {
		essential: true,
		functional: true,
		analytics: false,
		preferences: false
	};

	const submitCookiePreferenceCallback: SubmitFunction = () => {
		return async ({ result }) => {
			await applyAction(result);
			if (result.type === 'success') {
				await invalidateAll();
			}
		};
	};
</script>

<div
	class="card p-4 flex flex-col gap-12 fixed bottom-0 m-[2.5vw] left-0 right-0 max-w-[25rem] z-50"
	role="dialog"
	aria-label="cookie-banner"
	transition:fly={{ x: -500, easing: cubicInOut }}
>
	<p>
		We care about your data, and we'd love to use cookies in accordance with our <a
			href="/legal#privacy-policy">Privacy Policy</a
		> to make your experience better.
	</p>
	<form class="flex justify-end gap-4" method="post" use:enhance={submitCookiePreferenceCallback}>
		<button
			class="btn variant-ghost-primary"
			formaction="/?/setCookieConsent&cookie={JSON.stringify(rejectConsentCookie)}">Reject</button
		>
		<button
			class="btn variant-filled-tertiary"
			formaction="/?/setCookieConsent&cookie={JSON.stringify(acceptConsentCookie)}">Accept</button
		>
	</form>
</div>
