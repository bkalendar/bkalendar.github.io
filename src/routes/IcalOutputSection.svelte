<script lang="ts">
	import H2 from '$lib/H2.svelte';
	import OkeeButton from '$lib/OkeeButton.svelte';
	import { formatIcal, type Timetable } from '@bkalendar/core';

	export let timetable: Required<Timetable>;
	export let name: string;

	function download() {
		const data = `data:text/calendar,${encodeURIComponent(formatIcal(timetable))}`;
		const a = document.createElement('a');
		a.href = data;
		a.download = name;
		a.click();
		a.remove();
	}
</script>

<H2>😎 xem trước</H2>
<pre>{formatIcal(timetable)}</pre>
<div class="h-4" />
<div class="flex justify-center">
	<OkeeButton variant="navy" disabled={false} on:click={download}>👉 download</OkeeButton>
</div>
