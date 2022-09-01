<script lang="ts">
	import { goto } from '$app/navigation';
	import { diff, parseMachine, type MachineTimetable } from '@bkalendar/core';

	import OkeeButton from '$lib/OkeeButton.svelte';
	import { getTimetableCtx } from '$lib/timetable';
	import type { PageData } from './$types';

	import DiffEntries from './DiffEntries.svelte';
	import Semester from './Semester.svelte';

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

	$: current = selected === null ? null : timetables[selected];

	// store in context for subsequent client-side page access
	const timetableCtx = getTimetableCtx();
	$: if (current !== null) {
		timetableCtx.set(current);
	}

	async function addHandler() {
		await data.db.add(current!);
		await goto('/export');
	}
</script>

<div class="mx-auto w-full max-w-md px-5 pt-10">
	<h1 class="text-5xl font-bold tracking-tighter">
		<span class="bg-gradient-to-br from-sky-500 to-marine-300 bg-clip-text text-transparent">
			BK</span
		>alendar
	</h1>

	<p class="text-right">lịch đẹp cho những người thanh lịch 🌹</p>

	<textarea
		class="mt-5 h-32 w-full rounded bg-transparent p-2
			text-xs placeholder-slate-400
			outline-dashed outline-[1.5px] outline-slate-200 focus:outline-slate-500"
		placeholder="> ctrl+A trang stinfo rồi paste vào đây"
		bind:value={raw}
	/>

	<div class="mt-2 flex justify-end space-x-2">
		<select
			class="rounded bg-slate-100 px-2 py-1 text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
			disabled={timetables.length == 0}
			bind:value={selected}
		>
			{#each timetables as timetable, i (timetable.semester)}
				<option value={i}>
					<Semester semester={timetable.semester} />
				</option>
			{:else}
				<option value={null} selected disabled>...</option>
			{/each}
		</select>
		<OkeeButton disabled={selected === null} on:click={addHandler} />
	</div>
	<div class="mt-6">
		{#if selected !== null}
			{@const current = timetables[selected]}
			{#await data.db.getPrev(current) then prev}
				{#if !prev}
					<p class="text-center px-4 text-slate-300 ">
						Bấm ok để lưu lại thời khóa biểu. Lần sau mình sẽ so sánh xem thời khóa biểu có thay đổi
						không.
					</p>
				{:else}
					{@const { added, removed } = diff(current, prev, (s, r) => {
						return s.info.course === r.info.course && s.location.room == r.location.room;
					})}
					{#if added.length !== 0}
						<DiffEntries entries={added} type="added" />
					{/if}
					{#if removed.length != 0}
						<DiffEntries entries={removed} type="removed" />
					{/if}
					{#if added.length == 0 && removed.length == 0}
						<p class="slate-700 text-center">Không có thay đổi so với thời khóa biểu trước.</p>
					{/if}
				{/if}
			{/await}
		{/if}
	</div>
</div>
