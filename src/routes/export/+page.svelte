<script lang="ts">
	import type { PageData } from './$types';

	import { getTimetableCtx } from '$lib/timetable';
	import { transformGAPI } from '@bkalendar/core';
	import { randomColorIds } from './colors';
	import type { EventInput } from '$lib/types';
	import Preview from './Preview.svelte';
	import OkeeButton from '$lib/OkeeButton.svelte';
	import toast from '$lib/toast';

	export let data: PageData;

	const timetableCtx = getTimetableCtx();

	if (!$timetableCtx) $timetableCtx = data.latest;

	let lang: 'vi' | 'en' | '' = '';
	let events: EventInput[] = [];

	$: if ($timetableCtx) {
		// depends on lang
		lang;
		getEvents();
	}

	async function getEvents() {
		console.log(lang);
		if (lang === '') {
			events = transformGAPI($timetableCtx!);
			return;
		}
		let copy = structuredClone($timetableCtx!);
		for (const { info } of copy.timerows) {
			const res = await fetch(
				`https://raw.githubusercontent.com/bkalendar/courses/master/courses/${info.course}.json`
			);
			if (!res.ok) continue;
			const { monhoc, course } = await res.json();
			console.log(monhoc, course);
			if (lang === 'en') {
				info.name = course;
			} else if (lang === 'vi') {
				info.name = monhoc;
			}
		}
		events = transformGAPI(copy);
	}

	let colorMode: 'random' | 'mono' = 'random';
	let random = 0;
	$: {
		if (colorMode === 'mono') {
			for (const event of events) {
				event.colorId = undefined;
			}
		} else {
			const colorIds = [...randomColorIds(events.length)];
			for (const i in colorIds) {
				events[i].colorId = colorIds[i];
			}
		}
		random = random;
		events = events;
	}

	let calendarName = '';
	$: if ($timetableCtx) {
		const { semester, year } = $timetableCtx.semester;
		calendarName = `HK${year % 100}${semester}`;
	}

	let creating = false;
	async function authHandler() {
		try {
			await data.google.auth();
			creating = true;
			const calendar = await data.google.createCalendar(calendarName);
			await data.google.addEventsToCalendar(events, calendar.id);
			toast.push({ message: 'Tạo lịch thành công 👍', status: 'ok', duration: 5000 });
		} finally {
			creating = false;
		}
	}
</script>

<h1 class="text-center text-2xl font-bold tracking-tighter">
	xuất lịch <span
		class="ml-1 rounded border-[1.5px] border-sky-300 bg-sky-100 px-2 py-1 text-base font-normal text-sky-500"
		>{calendarName}</span
	>
</h1>

<h2 class="mt-6 text-xl font-bold tracking-tighter text-slate-800">🎨 đổi màu</h2>

<p class="mt-2 text-base">bạn là người chơi hệ:</p>

<div class="mt-4 flex justify-around text-base">
	<div class="relative">
		<input
			type="radio"
			name="color"
			id="mono"
			class="peer absolute opacity-0"
			bind:group={colorMode}
			value="mono"
		/>
		<label
			for="mono"
			class="block rounded px-2 py-4 hover:cursor-pointer hover:bg-slate-100
			peer-checked:bg-slate-200 peer-checked:shadow peer-checked:shadow-slate-500/20
			peer-focus:ring-2 peer-focus:ring-slate-500 peer-focus:ring-offset-2"
		>
			tối giản 🗿
		</label>
	</div>

	<div class="relative">
		<input
			type="radio"
			name="color"
			id="random"
			class="peer absolute opacity-0"
			bind:group={colorMode}
			value="random"
		/>
		<label
			for="random"
			class="block rounded px-2 py-4 hover:cursor-pointer
			hover:bg-rose-100 peer-checked:bg-gradient-to-br peer-checked:from-rose-300 peer-checked:to-rose-500 peer-checked:text-slate-50 peer-checked:shadow
			peer-checked:shadow-rose-500/30 peer-focus:ring-2 peer-focus:ring-rose-500
			peer-focus:ring-offset-2"
		>
			bảy sắc cầu vồng 💅
		</label>
	</div>
</div>

<Preview {events} />

<div class="mt-10 mb-5 flex justify-center space-x-3">
	{#if colorMode === 'random'}
		<button
			class="group  rounded border-[1.5px] border-slate-200 px-2 py-1 font-bold text-slate-400"
			on:click={() => ++random}
		>
			🎲 màu khác ik
		</button>
	{/if}

	<OkeeButton disabled={events.length === 0 || creating} on:click={authHandler} />
</div>
