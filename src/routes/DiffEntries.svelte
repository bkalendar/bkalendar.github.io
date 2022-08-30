<script lang="ts">
	import type { MachineTimerow } from '@bkalendar/core/dist/transformer/machine';
	import { formatRelative } from 'date-fns';
	import { vi } from 'date-fns/locale';

	export let entries: [Date, MachineTimerow][];
	export let type: 'added' | 'removed';

	const format = (date: Date) => formatRelative(date, new Date(), { locale: vi });
</script>

<h2
	class="mt-2 flex items-center space-x-1 rounded px-2 py-1 text-lg font-bold {type === 'added'
		? 'text-green-700'
		: 'text-rose-500'} {type === 'removed' ? 'bg-rose-100' : 'bg-green-100'}"
>
	{#if type === 'added'}
		<!-- prettier-ignore -->
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
			<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clip-rule="evenodd" />
		</svg>
		<span>Lịch thêm vào:</span>
	{:else}
		<!-- prettier-ignore -->
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
			<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clip-rule="evenodd" />
		</svg>
		<span>Lịch bớt đi:</span>
	{/if}
</h2>
<ul class="list mt-2 list-inside list-disc space-y-2 text-sm">
	{#each entries as [date, timerow]}
		<li>
			<span class="font-bold tracking-tight text-marine-500 marker:text-marine-500"
				>{format(date)} @ {timerow.location.room}</span
			>
			<br />
			{timerow.info.course} - {timerow.info.name}
		</li>
	{/each}
</ul>
