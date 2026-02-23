<script lang="ts">
	import { database } from '$lib/firebase';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { untrack } from 'svelte';

	let sundayBibleStudy = $state('');
	let sundayWorship = $state('');
	let wednesdayBibleStudy = $state('');
	let loaded = $state(false);
	let saveStatus = $state('');

	const defaults = {
		sundayBibleStudy: 'Hebrews',
		sundayWorship: '1 Peter',
		wednesdayBibleStudy: 'Isaiah'
	};

	async function load() {
		const reference = doc(database, 'content', 'homepage');
		const snap = await getDoc(reference);
		if (snap.exists()) {
			const data = snap.data();
			sundayBibleStudy = data.sundayBibleStudy ?? defaults.sundayBibleStudy;
			sundayWorship = data.sundayWorship ?? defaults.sundayWorship;
			wednesdayBibleStudy = data.wednesdayBibleStudy ?? defaults.wednesdayBibleStudy;
		} else {
			sundayBibleStudy = defaults.sundayBibleStudy;
			sundayWorship = defaults.sundayWorship;
			wednesdayBibleStudy = defaults.wednesdayBibleStudy;
			await setDoc(reference, defaults, { merge: true });
		}
		loaded = true;
	}

	$effect(() => {
		// Read reactive values to track them
		const values = { sundayBibleStudy, sundayWorship, wednesdayBibleStudy };

		// Don't auto-save until initial load is complete
		if (!untrack(() => loaded)) return;

		const timeout = setTimeout(async () => {
			try {
				await setDoc(doc(database, 'content', 'homepage'), values, { merge: true });
				saveStatus = 'Saved';
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
		<h2>Scripture Focus</h2>
		{#if saveStatus}
			<span class="save-status" class:error={saveStatus.startsWith('Error')}>{saveStatus}</span>
		{/if}
	</div>

	<label>
		Sunday Bible Study
		<input type="text" bind:value={sundayBibleStudy} />
	</label>

	<label>
		Sunday Worship
		<input type="text" bind:value={sundayWorship} />
	</label>

	<label>
		Wednesday Bible Study
		<input type="text" bind:value={wednesdayBibleStudy} />
	</label>
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
		margin-bottom: 1rem;
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

	label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		margin-bottom: 1rem;
		color: #57534e;
	}

	input {
		display: block;
		width: 100%;
		margin-top: 0.25rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid #d6d3d1;
		border-radius: 6px;
		font-size: 0.875rem;
		font-family: inherit;
	}

	input:focus {
		outline: 2px solid #78716c;
		outline-offset: 1px;
	}
</style>
