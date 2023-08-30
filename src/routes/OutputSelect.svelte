<script lang="ts">
	import H2 from '$lib/H2.svelte';

	export let output: 'ical' | 'gapi';
</script>

<label>
	<H2>📮 định dạng xuất lịch</H2>
	<select
		bind:value={output}
		class="mt-2 w-full rounded bg-slate-100 px-2 py-1 text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
	>
		<option value="ical">File .ics</option>
		<option value="gapi">Lịch Google</option>
	</select>
</label>
