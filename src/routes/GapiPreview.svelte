<script lang="ts">
	import { getDay, startOfDay } from 'date-fns';
	import { COLORS } from '../lib/colors';

	export let events: gapi.client.calendar.EventInput[];

	const getWeekday = (event: gapi.client.calendar.EventInput) => {
		// FIXME: take event.start.timezone into account
		// this:    0 -> 6, Sun -> Sar
		let weekday: number = getDay(new Date(event.start.dateTime!));
		// we want: 2 -> 8, Mon -> Sun
		weekday = ((weekday + 6) % 7) + 2;
		return weekday;
	};

	const getHours = (event: gapi.client.calendar.EventInput) => {
		// hours elapsed from start of day
		const elapsed = (date: Date) => {
			return (+date - +startOfDay(date)) / 1000 / 60 / 60;
		};
		return {
			start: Math.floor(elapsed(new Date(event.start.dateTime!))),
			end: Math.ceil(elapsed(new Date(event.end.dateTime!)))
		};
	};

	// the columns should start on Mon and end on Fri, or Sar/Sun if there are classes
	// the number of columns can be calculated as:
	let columns = Math.max(6, ...events.map(getWeekday)) - 1;
	// the rows should start from 6h to 18h
	let rows = Math.max(18, ...events.map(getHours).map(({ end }) => end)) - 6;

	const col = (weekday: number) => weekday - 1;
	const row = (hour: number) => hour - 5;
	const color = (event: gapi.client.calendar.EventInput) =>
		COLORS.get(event.colorId ?? '8')!.background;
</script>

<div
	class="mt-3 grid gap-x-1"
	style:grid-template-columns="repeat({columns}, minmax(0, 1fr))"
	style:grid-template-rows="repeat({rows}, minmax(0, 1fr))"
>
	{#each [...new Array(rows).keys()] as row}
		<div
			class="-mx-2
			{row % 2 == 1 ? 'bg-transparent' : 'border-b-[1.5px] border-dotted border-slate-200 bg-slate-100'}"
			style:grid-row="{row + 1} / span 1"
			style:grid-column="1 / span {columns}"
		/>
	{/each}
	{#each events as event}
		{@const weekday = getWeekday(event)}
		{@const { start, end } = getHours(event)}
		<div
			class="my-0.5 rounded px-1 py-0.5 text-xs italic text-slate-50 shadow-md"
			style:background-color={color(event)}
			style:grid-column="{col(weekday)} / span 1"
			style:grid-row="{row(start)} / {row(end)}"
		>
			<p class="line-clamp-3">
				{event.summary}
			</p>
		</div>
	{/each}
</div>
