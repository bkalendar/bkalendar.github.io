<script lang="ts">
	import type { PageData } from './$types.js';
	import { parseMachine, type MachineTimetable } from '@bkalendar/core';
	import { diff } from '@bkalendar/core';

	export let data: PageData;

	let raw: string = '';

	$: timetables = raw !== '' ? parseMachine(raw) : null;

	let selectedTimetable: MachineTimetable | null = null;

	$: console.log(timetables);

	async function add() {
		if (!timetables) return;
		for (const timetable of timetables) {
			await data.db.add(timetable);
		}
	}

	$: console.log(selectedTimetable);
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

<button on:click={add}>Add</button>

{#if timetables}
	<select bind:value={selectedTimetable}>
		{#each timetables as timetable}
			<option value={timetable}>{JSON.stringify(timetable.semester)}</option>
		{/each}
	</select>
{/if}
