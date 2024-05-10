<script lang="ts">
	import BKalendar from './BKalendar.svelte';
	import PasteArea from './PasteArea.svelte';
	import KindSelect from './KindSelect.svelte';
	import {
		parseLecturer,
		parsePostgrad,
		parseStudent,
		parseStudent2024,
		resolve,
		type Timetable
	} from '@bkalendar/core';
	import ErrorReport from './ErrorReport.svelte';
	import OutputSelect from './OutputSelect.svelte';
	import GapiOutputSection from './GapiOutputSection.svelte';
	import IcalOutputSection from './IcalOutputSection.svelte';
	import { fly } from 'svelte/transition';
	import Key from '$lib/Key.svelte';
	import NameInput from './NameInput.svelte';
	import OkeeButton from '$lib/OkeeButton.svelte';

	let raw: string;
	let kind: 'sinh viên 2024' | 'sinh viên' | 'giảng viên' | 'sau đại học' = 'sinh viên 2024';
	let output: 'ical' | 'gapi' = 'gapi';
	let step: 'import' | 'export' = 'import';
	let semester: number | undefined = undefined;
	let error: Error | null = null;
	let name: string;

	$: timetable = process(raw, kind);
	$: if (semester !== undefined && !`${semester}`.match(/^\d+[123]$/)) {
		error = new Error('mã học kỳ sai định dạng. ví dụ mã đúng: 231, 232, 233.');
	} else {
		error = null;
	}

	function process(r: typeof raw, k: typeof kind) {
		if (!raw) return null;

		let parse;
		switch (k) {
			case 'sinh viên 2024':
				parse = parseStudent2024;
				break;
			case 'sinh viên':
				parse = parseStudent;
				break;
			case 'giảng viên':
				parse = parseLecturer;
				break;
			case 'sau đại học':
				parse = parsePostgrad;
				break;
		}
		try {
			let timetable = parse(r);
			resolve(timetable);
			name = calendarName(kind, timetable);
			semester = timetable?.semester;
			error = null;
			return timetable;
		} catch (e) {
			error = e as Error;
			return null;
		}
	}

	function calendarName(k: typeof kind, timetable: Required<Timetable>) {
		switch (k) {
			case 'sinh viên':
				return `SV${timetable.semester}`;
			case 'giảng viên':
				return `GV${timetable.semester}`;
			case 'sau đại học':
				return `SDH${timetable.semester}`;
		}
	}

	function nextStep() {
		timetable!.semester = semester!;
		step = 'export';
	}
</script>

<svelte:head>
	<title>Nhập lịch | BKalendar</title>
</svelte:head>

<BKalendar />
<p class="text-right"><i>vì bạn xứng đáng có một bộ lịch đẹp 🌹</i></p>
<div class="h-4" />
{#if step == 'import'}
	<div out:fly={{ delay: 500, duration: 500, x: -100 }}>
		<p>
			hãy <Key>Ctrl</Key>
			<Key>A</Key> rồi <Key>Ctrl</Key>
			<Key>V</Key> thời khóa biểu của bạn vào bên dưới, mình sẽ tự trích lịch của bạn ra 🪄
		</p>
		<div class="h-4" />
		<PasteArea bind:raw />
		<div class="h-4" />
		<div class="flex items-center justify-end space-x-4">
			<p class="flex-shrink-0">học kỳ</p>
			<input
				type="number"
				class="inline w-16 outline-dashed outline-[1.5px] outline-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
				disabled={!timetable}
				bind:value={semester}
			/>
		</div>
		<div class="h-4" />
		<div class="flex justify-end">
			<OkeeButton variant="navy" disabled={!timetable || !!error} on:click={nextStep} />
		</div>
		{#if error}
			<div class="h-4" />
			<ErrorReport {error} />
		{/if}
		<div class="h-4" />
		<KindSelect bind:kind />
	</div>
{:else}
	<div in:fly={{ delay: 1000, x: 100 }}>
		<NameInput bind:name />
		<div class="h-4" />
		<OutputSelect bind:output />
		<div class="h-4" />
		{#if timetable}
			{#if output == 'gapi'}
				<GapiOutputSection {name} {timetable} />
			{:else}
				<IcalOutputSection {name} {timetable} />
			{/if}
		{/if}
	</div>
{/if}
