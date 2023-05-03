<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-10 bg-surface-100-800-token p-16">
		<h1 class="!leading-loose">Change Password</h1>
		<form class="flex flex-col gap-4" method="post" action="?/changePassword">
			<label class="label">
				<span>New Password:</span>
				<input type="password" class="input" placeholder="New Password" name="password" />
			</label>
			<label class="label">
				<span>Confirm New Password:</span>
				<input
					type="password"
					class="input"
					placeholder="Confirm New Password"
					name="confirmPassword"
				/>
			</label>
			<button class="btn variant-ringed-error">Change Password</button>
		</form>
	</div>
{/if}
