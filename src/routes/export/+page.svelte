<script lang="ts">
	import type { PageData } from '../../../.svelte-kit/types/src/routes/export/$types';

	import { getTimetableCtx } from '$lib/timetable';
	import { transformGAPI } from '@bkalendar/core';
	import { randomColorIds } from './colors';
	import type { EventInput } from '$lib/types';
	import Preview from './Preview.svelte';

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
</script>

<h1>Xuất lịch</h1>

<label>
	<input type="radio" name="lang" id="" bind:group={lang} value="" />
	default
</label>

<label>
	<input type="radio" name="lang" id="" bind:group={lang} value="vi" />
	vi
</label>

<label>
	<input type="radio" name="lang" id="" bind:group={lang} value="en" />
	en
</label>

<label>
	<input type="radio" name="color" id="" bind:group={colorMode} value="mono" />
	mono
</label>

<label>
	<input type="radio" name="color" id="" bind:group={colorMode} value="random" />
	random
</label>

<button on:click={() => ++random}>Random</button>

<Preview {events} />
