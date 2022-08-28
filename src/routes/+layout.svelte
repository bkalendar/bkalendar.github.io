<script>
	import '../app.postcss';

	import toasts from '$lib/toast';
</script>

<slot />

<div class="absolute bottom-0 inset-x-0">
	{#each $toasts as toast}
		<div class="bg-blue-200 px-2 py-1">{toast.message}</div>
	{/each}
</div>
