<script lang="ts">
	import '../app.postcss';
	import '@fontsource/arimo';
</script>

<svelte:head>
	<script src="https://apis.google.com/js/api.js" defer></script>
	<script src="https://accounts.google.com/gsi/client" defer></script>
</svelte:head>

<div class="mx-auto max-w-xs py-20 font-body">
	<slot />
</div>

<style>
	:global(body) {
		overflow-y: scroll;
	}
</style>
