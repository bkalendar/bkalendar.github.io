<script lang="ts">
	import H2 from '$lib/H2.svelte';

	export let name: string;
</script>

<H2>📅 tên lịch</H2>
<input
	bind:value={name}
	class="mt-2 w-full rounded bg-transparent p-2 text-center outline-dashed outline-[1.5px] outline-slate-200 focus:outline-slate-500"
/>
