<script lang="ts">
	import { authState, login, logout } from '$lib/auth.svelte.ts';
	import { database } from '$lib/firebase';
	import { doc, getDoc } from 'firebase/firestore';
	import ScriptureFocusForm from '$lib/components/ScriptureFocusForm.svelte';
	import CurrentEventsForm from '$lib/components/CurrentEventsForm.svelte';

	let publishing = $state(false);
	let publishStatus = $state('');

	async function publish() {
		publishing = true;
		publishStatus = '';
		try {
			const configSnap = await getDoc(doc(database, 'config', 'github'));
			if (!configSnap.exists()) {
				publishStatus = 'Error: GitHub config not found in Firestore';
				return;
			}

			const { pat } = configSnap.data();
			const response = await fetch(
				'https://api.github.com/repos/markgoho/kingston-church/dispatches',
				{
					method: 'POST',
					headers: {
						Accept: 'application/vnd.github.v3+json',
						Authorization: `token ${pat}`
					},
					body: JSON.stringify({
						event_type: 'cms-update'
					})
				}
			);

			if (response.ok || response.status === 204) {
				publishStatus = 'Build triggered! Site will update in a few minutes.';
			} else {
				publishStatus = `Error: GitHub API returned ${response.status}`;
			}
		} catch (e) {
			publishStatus = `Error: ${e instanceof Error ? e.message : 'Unknown error'}`;
		} finally {
			publishing = false;
		}
	}
</script>

{#if authState.loading}
	<div class="center">
		<p>Loading...</p>
	</div>
{:else if !authState.user}
	<div class="center">
		<div class="login-card">
			<h1>Kingston Church Admin</h1>
			<p>Sign in to manage website content.</p>
			<button onclick={login}>Sign in with Google</button>
		</div>
	</div>
{:else if !authState.allowed}
	<div class="center">
		<div class="login-card">
			<h1>Access Denied</h1>
			<p>Your account ({authState.user.email}) is not authorized to use this tool.</p>
			<button onclick={logout}>Sign Out</button>
		</div>
	</div>
{:else}
	<div class="dashboard">
		<header>
			<h1>Kingston Church Admin</h1>
			<div class="header-right">
				<span class="user-email">{authState.user.email}</span>
				<button class="sign-out" onclick={logout}>Sign Out</button>
			</div>
		</header>

		<main>
			<ScriptureFocusForm />
			<CurrentEventsForm />

			<section class="card publish-card">
				<h2>Publish Changes</h2>
				<p>After saving your changes above, click Publish to rebuild and deploy the website.</p>
				<div class="actions">
					<button class="publish-btn" onclick={publish} disabled={publishing}>
						{publishing ? 'Publishing...' : 'Publish to Website'}
					</button>
					{#if publishStatus}
						<span
							class="status"
							class:error={publishStatus.startsWith('Error')}
						>
							{publishStatus}
						</span>
					{/if}
				</div>
			</section>
		</main>
	</div>
{/if}

<style>
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}

	.login-card {
		background: white;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
		text-align: center;
		max-width: 400px;
		width: 100%;
		margin: 1rem;
	}

	.login-card h1 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.login-card p {
		color: #57534e;
		margin-bottom: 1.5rem;
	}

	.login-card button {
		background: #292524;
		color: white;
		border: none;
		padding: 0.625rem 1.5rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		font-family: inherit;
	}

	.login-card button:hover {
		background: #44403c;
	}

	.dashboard {
		max-width: 720px;
		margin: 0 auto;
		padding: 1rem;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	header h1 {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.user-email {
		font-size: 0.8125rem;
		color: #78716c;
	}

	.sign-out {
		background: none;
		border: 1px solid #d6d3d1;
		padding: 0.375rem 0.75rem;
		border-radius: 6px;
		font-size: 0.8125rem;
		cursor: pointer;
		color: #57534e;
		font-family: inherit;
	}

	.sign-out:hover {
		background: #f5f5f4;
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.card {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
	}

	.publish-card h2 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.publish-card p {
		font-size: 0.875rem;
		color: #57534e;
		margin-bottom: 1rem;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.publish-btn {
		background: #15803d;
		color: white;
		border: none;
		padding: 0.5rem 1.25rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		font-family: inherit;
	}

	.publish-btn:hover {
		background: #166534;
	}

	.publish-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.status {
		font-size: 0.875rem;
		color: #16a34a;
	}

	.status.error {
		color: #dc2626;
	}
</style>
