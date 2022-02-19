<script lang="ts">
    import type { TimetableResolved } from '$lib/timetable';
    import { parseAndResolveTimetables } from "$lib/timetable";
    import Settings from "$lib/Settings.svelte";
    import { fly, slide } from "svelte/transition";
    import { toVCalendar } from "$lib/ical";

    let rawTimetable;
    let timetable: TimetableResolved;
    let downloadLink;
    let openSettings = false;
    let notice;
    $: try {
        if (rawTimetable) {
            timetable = parseAndResolveTimetables(rawTimetable)[0];
        }
        else timetable = undefined;
    } catch {
        timetable = undefined;
        notice.classList.add("animate-shake");
        setTimeout(() => notice.classList.remove("animate-shake"), 1000);
    }

    $: downloadLink =
        timetable &&
        `data:text/calendar,${encodeURIComponent(toVCalendar(timetable))}`;
</script>

<div
    class="h-full w-full max-w-xl mx-auto flex flex-col justify-center text-xl dark:text-shadow-md"
>
    <h1 class="text-5xl font-sans text-center font-bold text-blue-500 mb-7">
        <span class="text-blue-deep dark:text-blue">BK</span><span
            class="text-blue dark:text-white">alendar</span
        >
    </h1>
    <label for="timetable-input">
        <p class="text-center">Copy rồi dán thời khóa biểu vào đây</p>
        <textarea
            id="timetable-input"
            class="mt-2 rounded w-full h-32 p-2 dark:bg-transparent border-2 border-blue font-mono"
            bind:value={rawTimetable}
        />
    </label>
    {#if !downloadLink}
        <p
            class="font-thin italic mt-2 py-1 border-2 border-transparent text-center"
            transition:slide|local
            bind:this={notice}
        >
            Copy từ dòng "Học kỳ 1..." đến cuối cái bảng nhé.
        </p>
    {:else}
        <a
            transition:slide|local
            href={downloadLink}
            download="bkalendar"
            class="mx-auto flex items-center justify-center transition duration-200 bg-blue w-28 px-2 py-1 rounded-md mt-2 border-2 border-blue text-white hover:text-currentColor hover:bg-white group shadow-md hover:shadow-none dark:hover:bg-transparent"
        >
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1 group-hover:text-blue transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
      </svg>
            Tải về
        </a>
        <button
            on:click={() => (openSettings = !openSettings)}
            transition:slide|local={{ delay: 500 }}
            class="mx-auto w-32 mt-2 opacity-20 hover:opacity-100"
            >Tùy chỉnh</button
        >
    {/if}
    {#if openSettings}
        <div transition:fly|local>
            <Settings bind:timetable />
        </div>
    {/if}
</div>
