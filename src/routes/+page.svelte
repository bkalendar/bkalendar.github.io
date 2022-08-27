<script lang="ts">
	import type { PageData } from './$types.js';
	import {
		parseMachine,
		transformGAPI,
		transformICal,
		type MachineTimetable
	} from '@bkalendar/core';
	import { diff } from '@bkalendar/core';
	import Semester from './Semester.svelte';
	import { page } from '$app/stores';

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

	async function addHandler() {
		data.db.add(timetables[selected!]);
	}

	async function authHandler() {
		try {
			await $page.data.google.auth();
			await $page.data.google.createTimetable(timetables[selected!], { useRandomColors: true });
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
