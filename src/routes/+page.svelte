<script lang="ts">
	import type { PageData } from './$types';
	import {
		parseMachine,
		transformGAPI,
		transformICal,
		type MachineTimetable
	} from '@bkalendar/core';
	import { diff } from '@bkalendar/core';
	import Semester from './Semester.svelte';
	import { COLORS, randomColorIds } from './colors';
	import toasts from '$lib/toast';

	export let data: PageData;

	let raw: string = '';
	let timetables: MachineTimetable[] = [];
	let selected: number | null = null;
	$: if (raw) {
		timetables = parseMachine(raw).reverse();
		if (selected === null && timetables.length != 0) {
			selected = 0;
		}
	}

	$: if (selected !== null) {
		const current = timetables[selected];
		data.db.getPrev(current).then((prev) => {
			console.log('prev', prev);
			if (prev && current) {
				console.log(
					'diff',
					diff(current, prev, (s, r) => {
						return s.info.course === r.info.course && r.location.room == r.location.room;
					})
				);
			}
		});
	}

	$: events = selected === null ? [] : transformGAPI(timetables[selected]);

	let random = 1;
	$: colorIds =
		random == 0 || selected === null
			? []
			: [...randomColorIds(timetables[selected].timerows.length)];

	async function addHandler() {
		data.db.add(timetables[selected!]);
	}

	async function authHandler() {
		try {
			await data.google.auth();
			await data.google.createTimetable(timetables[selected!], { colorIds });
			toasts.push({
				status: 'ok',
				message: 'thanh cong',
				duration: 2000
			});
		} catch (e) {
			console.error(e);
		}
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<textarea class="border" bind:value={raw} />

<select class="disabled:cursor-not-allowed" disabled={timetables.length == 0} bind:value={selected}>
	{#each timetables as timetable, i (timetable.semester)}
		<option value={i}>
			<Semester semester={timetable.semester} />
		</option>
	{:else}
		<option value={null} selected disabled>Nhập khóa biểu trước đê</option>
	{/each}
</select>

<button class="disabled:cursor-not-allowed" disabled={selected === null} on:click={addHandler}>
	Add
</button>

{#if selected !== null}
	<a
		href="data:text/calendar,{encodeURIComponent(transformICal(timetables[selected]))}"
		download="bkalendar"
	>
		Tải về
	</a>
{/if}

<button on:click={authHandler} disabled={selected === null}>Auth</button>

{#if selected !== null}
	<div>
		{#each events as event, i}
			{@const colorId = colorIds[i]}
			{@const { background } = COLORS.get(colorId) ?? { background: '#000' }}
			<div class="rounded p-2" style:background-color={background}>
				<p>color: {colorId}</p>
				<p>{event.summary}</p>
			</div>
		{/each}
	</div>
	<button on:click={() => ++random}>randomize</button>
{/if}
