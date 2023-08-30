<script lang="ts">
	import BKalendar from './BKalendar.svelte';
	import PasteArea from './PasteArea.svelte';
	import KindSelect from './KindSelect.svelte';
	import { parseLecturer, parseStudent, resolve } from '@bkalendar/core';
	import ErrorReport from './ErrorReport.svelte';
	import OutputSelect from './OutputSelect.svelte';
	import GapiOutputSection from './GapiOutputSection.svelte';
	import IcalOutputSection from './IcalOutputSection.svelte';
	import { fly } from 'svelte/transition';

	let raw: string;
	let kind: 'sinh viên' | 'giảng viên' = 'sinh viên';
	let output: 'ical' | 'gapi' = 'gapi';

	let error: unknown;
	$: timetable = process(raw, kind);

	function process(r: typeof raw, k: typeof kind) {
		if (!raw) return null;

		let parse;
		switch (k) {
			case 'sinh viên':
				parse = parseStudent;
				break;
			case 'giảng viên':
				parse = parseLecturer;
				break;
		}
		try {
			let timetable = parse(r);
			resolve(timetable);
			error = null;
			return timetable;
		} catch (e) {
			error = e;
			return null;
		}
	}
</script>

<svelte:head>
	<title>Nhập lịch | BKalendar</title>
</svelte:head>

<BKalendar />
<p class="text-right">vì bạn xứng đáng có một bộ lịch đẹp 🌹</p>
<div class="h-4" />
{#if !timetable}
	<div out:fly={{ delay: 500, duration: 500, x: -100 }}>
		<PasteArea bind:raw />
		<div class="h-4" />
		<KindSelect bind:kind />
		<div class="h-4" />
		{#if error}
			<ErrorReport {error} />
		{/if}
	</div>
{:else}
	<div in:fly={{ delay: 1000, x: 100 }}>
		<OutputSelect bind:output />
		<div class="h-4" />
		{#if timetable}
			{#if output == 'gapi'}
				<GapiOutputSection {timetable} />
			{:else}
				<IcalOutputSection {timetable} />
			{/if}
		{/if}
	</div>
{/if}
