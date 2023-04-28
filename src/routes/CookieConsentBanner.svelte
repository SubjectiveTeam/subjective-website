<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
    import { fly } from "svelte/transition";

    const acceptConsentCookie = {
		essential: true,
		functional: true,
		analytics: true,
		preferences: true
	}
	const rejectConsentCookie = {
		essential: true,
		functional: true,
		analytics: false,
		preferences: false
	}

    const submitCookiePreferenceCallback: SubmitFunction = () => {
        return async ({result}) => {
            await applyAction(result);
            if (result.type==='success') {
                await invalidateAll();
            }
        }
	}
</script>

<div class="card p-4 fixed bottom-12 left-16 flex flex-col w-96 gap-12" transition:fly={{x: -500}}>
    <p>We care about your data, and we'd love to use cookies in accordance with our <a href="/legal#privacy-policy">Privacy Policy</a> to make your experience better.</p>
    <form class="flex justify-end gap-4" method="post" use:enhance={submitCookiePreferenceCallback}>
        <button class="btn variant-ghost-primary" formaction="/?/setCookieConsent&cookie={JSON.stringify(rejectConsentCookie)}">Reject</button>
        <button class="btn variant-filled-tertiary" formaction="/?/setCookieConsent&cookie={JSON.stringify(acceptConsentCookie)}">Accept</button>
    </form>
</div>