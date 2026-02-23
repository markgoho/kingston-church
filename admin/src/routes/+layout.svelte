<script lang="ts">
	import { initAuth } from '$lib/auth.svelte.ts';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	initAuth();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
	}

	:global(body) {
		font-family: 'Inter', system-ui, sans-serif;
		background: #f5f5f4;
		color: #1c1917;
		line-height: 1.6;
	}
</style>
