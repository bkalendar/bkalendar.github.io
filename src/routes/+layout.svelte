<script>
	import '../app.postcss';
	import '@fontsource/arimo/400.css';
	import '@fontsource/arimo/700.css';
	import '@fontsource/arimo/400-italic.css';

	import toasts from '$lib/toast';
	import { createTimetableCtx } from '$lib/timetable';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';

	createTimetableCtx();
</script>

<svelte:head>
	<title>{$page.data.title}</title>
</svelte:head>

<main
	class="relative mx-auto min-h-screen max-w-sm px-2 pt-6 pb-10 font-body text-sm text-slate-800 accent-sky-500"
>
	<slot />

	<footer class="absolute inset-x-0 bottom-2 flex justify-center text-slate-400">
		<p class="font-mono">
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

<div class="fixed inset-x-0 bottom-0 z-50 mb-5 space-y-2">
	{#each $toasts as toast (toast)}
		<div
			class="mx-auto w-64 rounded bg-sky-100 px-4 py-2 font-bold text-sky-500 shadow-md"
			transition:fly={{ y: 10 }}
		>
			{toast.message}
		</div>
	{/each}
</div>
