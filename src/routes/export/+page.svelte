<script lang="ts">
	import type { PageData } from '../../../.svelte-kit/types/src/routes/export/$types';

	import { getTimetableCtx } from '$lib/timetable';
	import { transformGAPI } from '@bkalendar/core';
	import { COLORS, randomColorIds, type Color } from './colors';
	import { getDay, getHours, getMinutes } from 'date-fns';
	import type { EventInput } from '$lib/types';
	import { scaleLinear } from 'd3-scale';

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
		random = random;
		map = map;
		const colorIds = [...randomColorIds(events.length)];
		for (const i in colorIds) {
			events[i].colorId = colorIds[i];
		}
	}

	let map: Map<number, EventInput[]> = new Map();
	$: {
		map.clear();
		for (const event of events) {
			// from 0 to 6, Sun to Sar
			let weekday: number = getDay(new Date(event.start.dateTime!));
			// from 2 to 8, Mon to Sun
			weekday = ((weekday + 6) % 7) + 2;
			let entry = map.get(weekday);
			if (!entry) {
				map.set(weekday, [event]);
			} else {
				entry.push(event);
			}
		}
	}

	let calendarHeight = 0;

	let y: (y1: number) => number;
	$: {
		y = scaleLinear().range([0, calendarHeight]).domain([0, 24]);
	}

	$: columns = Math.max(6, ...map.keys()) - 1;
</script>

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

<div
	class="grid h-96 grid-flow-col items-stretch gap-x-1"
	style:grid-template-columns="repeat({columns}, minmax(0, 1fr))"
	bind:clientHeight={calendarHeight}
>
	{#each [...new Array(columns).keys()].map((i) => i + 2) as weekday}
		{@const events = map.get(weekday) || []}
		<div>
			<p>{weekday}</p>
			<ul class="relative">
				{#each events as event}
					{@const start = getHours(new Date(event.start.dateTime || 0))}
					{@const end =
						getHours(new Date(event.end.dateTime || 0)) +
						getMinutes(new Date(event.end.dateTime || 0)) / 60}
					{@const color = COLORS.get(event.colorId || '')}
					<li
						class="absolute inset-x-0 overflow-hidden overflow-ellipsis whitespace-nowrap rounded p-1 text-xs text-slate-50"
						style:top="{y(start)}px"
						style:height="{y(end) - y(start)}px"
						style:background-color={colorMode === 'mono' ? '' : color?.background}
						class:bg-sky-500={colorMode === 'mono'}
					>
						{event.summary}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
