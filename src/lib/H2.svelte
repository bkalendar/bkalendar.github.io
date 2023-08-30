<script lang="ts">
	export let variant: 'slate' | 'rose' = 'slate';
</script>

<h2
	class="mb-2 mt-4 text-xl font-bold tracking-tighter {variant == 'slate'
		? 'text-slate-800'
		: 'text-rose-500'}"
>
	<slot />
</h2>
