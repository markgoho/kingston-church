<script lang="ts">
	import { database } from '$lib/firebase';
	import { doc, getDoc, setDoc } from 'firebase/firestore';

	let currentEvents = $state('');
	let saving = $state(false);
	let status = $state('');

	const defaultCurrentEvents = `Remember in prayer those with spiritual struggles and those absent from our regular assemblies. Also, remember those with ongoing physical struggles.

Sunday morning in the book of John, we see Jesus is God and the reality that He was Israel's fulfillment in the old testament scriptures. Because of Israel's rejection of Him, all people of all nations can now call upon the name of Jesus calling Him, "my Lord and my God" as Thomas did. Whether you accept Him or reject Him, we are all going to answer to Him when we pass from this life.  Join us.

Every first Wednesday of the month will be a singing night. Join us as we encourage one another to learn new songs and praise God.`;

	async function load() {
		const reference = doc(database, 'content', 'homepage');
		const snap = await getDoc(reference);
		if (snap.exists()) {
			currentEvents = snap.data().currentEvents ?? defaultCurrentEvents;
		} else {
			currentEvents = defaultCurrentEvents;
			await setDoc(reference, { currentEvents: defaultCurrentEvents }, { merge: true });
		}
	}

	async function save() {
		saving = true;
		status = '';
		try {
			await setDoc(doc(database, 'content', 'homepage'), { currentEvents }, { merge: true });
			status = 'Saved!';
		} catch (e) {
			status = `Error: ${e instanceof Error ? e.message : 'Unknown error'}`;
		} finally {
			saving = false;
		}
	}

	load();
</script>

<section class="card">
	<h2>Current Events / Announcements</h2>
	<p class="hint">Markdown is supported. This replaces the "Current Events" section on the homepage.</p>

	<textarea bind:value={currentEvents} rows="10"></textarea>

	<div class="actions">
		<button onclick={save} disabled={saving}>
			{saving ? 'Saving...' : 'Save'}
		</button>
		{#if status}
			<span class="status" class:error={status.startsWith('Error')}>{status}</span>
		{/if}
	</div>
</section>

<style>
	.card {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
	}

	h2 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.hint {
		font-size: 0.8125rem;
		color: #78716c;
		margin-bottom: 1rem;
	}

	textarea {
		display: block;
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d6d3d1;
		border-radius: 6px;
		font-size: 0.875rem;
		font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
		resize: vertical;
		margin-bottom: 1rem;
	}

	textarea:focus {
		outline: 2px solid #78716c;
		outline-offset: 1px;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	button {
		background: #292524;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		font-family: inherit;
	}

	button:hover {
		background: #44403c;
	}

	button:disabled {
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
