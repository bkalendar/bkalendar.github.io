<script>
	import '../app.postcss';
	import '@fontsource/arimo/400.css';
	import '@fontsource/arimo/700.css';

	import toasts from '$lib/toast';
</script>

<main class="relative min-h-screen font-body text-sm text-slate-800">
	<slot />

	<div class="absolute inset-x-0 bottom-0">
		{#each $toasts as toast}
			<div class="bg-blue-200 px-2 py-1">{toast.message}</div>
		{/each}
	</div>
	<footer class="absolute inset-x-0 bottom-0 flex justify-center">
		<span>site source · 2022</span>
	</footer>
</main>
