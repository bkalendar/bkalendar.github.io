<script lang="ts">
	import Key from '$lib/Key.svelte';

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
	<p class="text-right">vì bạn xứng đáng có một bộ lịch đẹp 🌹</p>

	<textarea
		class="mt-5 h-32 w-full rounded bg-transparent p-2
			text-xs placeholder-slate-400
			outline-dashed outline-[1.5px] outline-slate-200 focus:outline-slate-500"
		placeholder="> ctrl+A trang stinfo rồi paste vào đây"
		bind:value={raw}
	/>

	<details open={selected === null}>
		<summary class="my-2 rounded bg-slate-50 py-1 px-2 font-bold text-slate-600"
			>📙 hướng dẫn chi tiết</summary
		>

		<ol class="list-inside list-decimal space-y-2">
			<li>
				vào <a
					href="https://mybk.hcmut.edu.vn/stinfo/"
					target="_blank"
					class="font-mono text-sky-500 underline">mybk/stinfo</a
				>;
			</li>
			<li>
				bấm vào ô <span class="text-sky-500"
					>thời khóa biểu <img
						src="https://mybk.hcmut.edu.vn/stinfo/public/uploads/avatars/1477389315-calendar-1.png"
						alt="thời khóa biểu"
						class="inline h-5 w-5"
					/></span
				>;
			</li>
			<li>
				nhấn <Key>Ctrl/⌘</Key>
				<Key>A</Key> rồi <Key>Ctrl/⌘</Key>
				<Key>C</Key> để copy thời khóa biểu (yes, <em>toàn bộ</em> trang luôn);
			</li>
			<li><Key>Ctrl/⌘</Key> <Key>V</Key> vào khung bên trên.</li>
			<li>đến lúc <em>Okee</em> rồi</li>
		</ol>
	</details>

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
