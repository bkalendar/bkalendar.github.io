<script>
	import '../app.postcss';
	import '@fontsource/arimo/400.css';
	import '@fontsource/arimo/700.css';

	import toasts from '$lib/toast';
	import { createTimetableCtx } from '$lib/timetable';
	import { page } from '$app/stores';

	createTimetableCtx();
</script>

<svelte:head>
	<title>{$page.data.title}</title>
</svelte:head>

<main class="relative min-h-screen pb-10 font-body text-sm text-slate-800 px-2">
	<slot />

	<div class="absolute inset-x-0 bottom-0">
		{#each $toasts as toast}
			<div class="bg-blue-200 px-2 py-1">{toast.message}</div>
		{/each}
	</div>
	<footer class="absolute inset-x-0 bottom-2 flex justify-center text-slate-400">
		<p>
			<a
				href="https://github.com/bkalendar/bkalendar.github.io"
				target="_blank"
				class="underline underline-offset-2"
			>
				site source
			</a> · 2022
		</p>
	</footer>
</main>
