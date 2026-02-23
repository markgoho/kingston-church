<script lang="ts">
	import { database } from '$lib/firebase';
	import { publishState } from '$lib/publish-state.svelte.ts';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { untrack } from 'svelte';

	let currentEvents = $state('');
	let loaded = $state(false);
	let saveStatus = $state('');

	const defaultCurrentEvents = `Remember in prayer those with spiritual struggles and those absent from our regular assemblies. Also, remember those with ongoing physical struggles.

Sunday morning in the book of John, we see Jesus is God and the reality that He was Israel's fulfillment in the old testament scriptures. Because of Israel's rejection of Him, all people of all nations can now call upon the name of Jesus calling Him, "my Lord and my God" as Thomas did. Whether you accept Him or reject Him, we are all going to answer to Him when we pass from this life.  Join us.

Every first Wednesday of the month will be a singing night. Join us as we encourage one another to learn new songs and praise God.`;

	async function load() {
		const reference = doc(database, 'content', 'homepage');
		const snap = await getDoc(reference);
		if (snap.exists() && snap.data().currentEvents) {
			currentEvents = snap.data().currentEvents;
		} else {
			currentEvents = defaultCurrentEvents;
			await setDoc(reference, { currentEvents: defaultCurrentEvents }, { merge: true });
		}
		loaded = true;
	}

	$effect(() => {
		// Read reactive value to track it
		const value = currentEvents;

		// Don't auto-save until initial load is complete
		if (!untrack(() => loaded)) return;

		const timeout = setTimeout(async () => {
			try {
				await setDoc(doc(database, 'content', 'homepage'), { currentEvents: value }, { merge: true });
				saveStatus = 'Saved';
				publishState.hasUnpublishedChanges = true;
				setTimeout(() => { saveStatus = ''; }, 2000);
			} catch {
				saveStatus = 'Error saving';
			}
		}, 800);

		return () => clearTimeout(timeout);
	});

	load();
</script>

<section class="card">
	<div class="card-header">
		<h2>Current Events / Announcements</h2>
		{#if saveStatus}
			<span class="save-status" class:error={saveStatus.startsWith('Error')}>{saveStatus}</span>
		{/if}
	</div>
	<p class="hint">Markdown is supported. This replaces the "Current Events" section on the homepage.</p>

	<textarea bind:value={currentEvents} rows="10"></textarea>
</section>

<style>
	.card {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.25rem;
	}

	h2 {
		font-size: 1.125rem;
		font-weight: 600;
	}

	.save-status {
		font-size: 0.75rem;
		color: #16a34a;
	}

	.save-status.error {
		color: #dc2626;
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
	}

	textarea:focus {
		outline: 2px solid #78716c;
		outline-offset: 1px;
	}
</style>
