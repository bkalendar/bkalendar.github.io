<script lang="ts">
	import { formatGapi, type Timetable } from '@bkalendar/core';
	import GapiPreview from './GapiPreview.svelte';
	import H2 from '$lib/H2.svelte';
	import RadioButton from '$lib/RadioButton.svelte';
	import { randomColorIds } from '$lib/colors';
	import OkeeButton from '$lib/OkeeButton.svelte';

	export let timetable: Required<Timetable>;
	export let name: string;
	let mode: 'mono' | 'random' = 'random';
	let seed: number = 0;
	let ready = false;

	$: events = colorEvents(timetable, mode, seed);

	function colorEvents(t: typeof timetable, m: typeof mode, _: number) {
		const events = formatGapi(t);
		if (m == 'mono') return events;

		const colorIds = [...randomColorIds(events.length)];
		for (const i in colorIds) {
			events[i].colorId = colorIds[i];
		}
		return events;
	}

	async function callGapi() {
		ready = true;
		const { default: gapi } = await import('$lib/google');
		try {
			await gapi.auth();
			const calendar = await gapi.createCalendar(name);
			await gapi.addEventsToCalendar(events, calendar.id);
			alert('Đã thêm lịch thành công');
		} catch (e) {
			console.error(e);
		} finally {
			ready = false;
		}
	}
</script>

<H2>🎨 màu sắc</H2>

<p>bạn là người chơi hệ:</p>

<div class="mt-4 flex justify-around text-base">
	<RadioButton bind:group={mode} value="mono" variant="slate">🗿 tối giản</RadioButton>
	<RadioButton bind:group={mode} value="random" variant="rose">💅 bảy sắc cầu vồng</RadioButton>
</div>

<H2>😎 xem trước</H2>
<p>cái lịch sẽ nhìn giống giống thế này:</p>
<GapiPreview {events} />
<div class="h-4" />
<div class="flex justify-center">
	{#if mode == 'random'}
		<OkeeButton disabled={ready} variant="slate" on:click={() => seed++}>🎲 màu khác ik</OkeeButton>
		<div class="w-4" />
	{/if}
	<OkeeButton disabled={ready} variant="navy" on:click={callGapi}>
		{!ready ? '👌 okee' : '🏃‍♂️ đang thêm...'}
	</OkeeButton>
</div>
