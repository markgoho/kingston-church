<script lang="ts">
	import { db } from '$lib/firebase';
	import { doc, getDoc, setDoc } from 'firebase/firestore';

	let sundayBibleStudy = $state('');
	let sundayWorship = $state('');
	let wednesdayBibleStudy = $state('');
	let saving = $state(false);
	let status = $state('');

	const defaults = {
		sundayBibleStudy: 'Hebrews',
		sundayWorship: '1 Peter',
		wednesdayBibleStudy: 'Isaiah'
	};

	async function load() {
		const ref = doc(db, 'content', 'homepage');
		const snap = await getDoc(ref);
		if (snap.exists()) {
			const data = snap.data();
			sundayBibleStudy = data.sundayBibleStudy ?? defaults.sundayBibleStudy;
			sundayWorship = data.sundayWorship ?? defaults.sundayWorship;
			wednesdayBibleStudy = data.wednesdayBibleStudy ?? defaults.wednesdayBibleStudy;
		} else {
			sundayBibleStudy = defaults.sundayBibleStudy;
			sundayWorship = defaults.sundayWorship;
			wednesdayBibleStudy = defaults.wednesdayBibleStudy;
			await setDoc(ref, defaults, { merge: true });
		}
	}

	async function save() {
		saving = true;
		status = '';
		try {
			await setDoc(
				doc(db, 'content', 'homepage'),
				{ sundayBibleStudy, sundayWorship, wednesdayBibleStudy },
				{ merge: true }
			);
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
	<h2>Scripture Focus</h2>

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
		margin-bottom: 1rem;
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
