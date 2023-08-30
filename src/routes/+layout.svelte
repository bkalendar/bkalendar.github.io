<script lang="ts">
	import '../app.postcss';
	import '@fontsource/arimo';
</script>

<div class="mx-auto max-w-xs py-20 font-body">
	<slot />
</div>

<style>
	:global(body) {
		overflow-y: scroll;
	}
</style>
