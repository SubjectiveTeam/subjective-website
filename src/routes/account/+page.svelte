<script lang="ts">
	import { page } from "$app/stores";
	import NewPasswordModal from "$lib/components/NewPasswordModal.svelte";
    import { TabGroup, Tab, modalStore, type ModalSettings, type ModalComponent, Modal } from "@skeletonlabs/skeleton";

    let tabSet: number = 0;

    const triggerNewPasswordModal = () => {
        const ModalComponent: ModalComponent = {
            ref: NewPasswordModal,
            props: { background: 'bg-red-500' },
        }
        const modalSettings: ModalSettings = {
            type: 'component',
            component: ModalComponent
        }
        modalStore.trigger(modalSettings);
    }
</script>

<section>
    <h1 class="!leading-loose">Account</h1>
    <TabGroup>
        <Tab bind:group={tabSet} name="personal-info" value={0}>Personal Info</Tab>
        <Tab bind:group={tabSet} name="payment-info" value={1}>Payment Info</Tab>
        <svelte:fragment slot="panel">
            {#if tabSet === 0}
                <form class="flex flex-col gap-4">
                    <label class="label max-w-lg">
                        <span>Email:</span>
                        <input type="text" class="input" disabled value={$page.data.session?.user.email} />
                    </label>
                    <button class="btn variant-ringed-error w-fit" on:click={triggerNewPasswordModal}>Change Password</button>
                </form>
            {:else if tabSet === 1}
                (tab panel 2 contents)
            {/if}
        </svelte:fragment>
    </TabGroup>
</section>