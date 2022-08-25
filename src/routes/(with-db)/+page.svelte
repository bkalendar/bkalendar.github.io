<script lang="ts">
	import type { PageData } from './$types.js';
	import { parseMachine, type MachineTimetable } from '@bkalendar/core';
	import { diff } from '@bkalendar/core';
	import Semester from './Semester.svelte';

	export let data: PageData;

	let raw: string = '';
	$: timetables = raw !== '' ? parseMachine(raw).reverse() : [];

	let selectedTimetable: MachineTimetable | null = null;
	$: if (timetables.length != 0) {
		selectedTimetable = timetables[0];
	}

	$: if (selectedTimetable)
		data.db.getPrev(selectedTimetable).then((prev) => {
			console.log('prev', prev);
			if (prev && selectedTimetable) {
				console.log(
					'diff',
					diff(selectedTimetable, prev, (s, r) => {
						return s.info.course === r.info.course && r.location.room == r.location.room;
					})
				);
			}
		});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<textarea class="border" bind:value={raw} />

<select
	class="disabled:cursor-not-allowed"
	disabled={timetables.length == 0}
	bind:value={selectedTimetable}
>
	{#each timetables as timetable}
		<option value={timetable}>
			<Semester semester={timetable.semester} />
		</option>
	{:else}
		<option value={null} selected disabled>Nhập khóa biểu trước đê</option>
	{/each}
</select>

<button
	class="disabled:cursor-not-allowed"
	disabled={selectedTimetable === null}
	on:click={() => data.db.add(selectedTimetable)}
>
	Add
</button>
