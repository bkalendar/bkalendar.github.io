<script lang="ts">
    import EntryDiffPreview from "../lib/EntryDiffPreview.svelte";

    import EntryEdit from "$lib/EntryEdit.svelte";

    import Select from "svelte-select";
    import CalendarIcon from "$lib/CalendarIcon.svelte";
    import type { EntryResolved } from "$lib/entry";
    import {
        loadTimetable,
        parseAndResolveTimetables,
        saveTimetable,
    } from "$lib/timetable";
    import { browser } from "$app/env";
    import { diffResolvedEntries } from "$lib/differ";

    const items = ["KHANG NGUYEN DUY", "HK211"];

    let value = items[0];

    let raw = `Học kỳ 2 Năm học 2020 - 2021
  Ngày cập nhật:2021-07-07 12:38:43.0
  Mã MH	Tên môn học	Tín chỉ	Tc học phí	Nhóm-Tổ	Thứ	Tiết	Giờ học	Phòng	Cơ sở	Tuần học
  CO1007	Cấu trúc rời rạc cho khoa học máy tính 	4	4	L01	2	2-3	7:00 - 8:50	H1-401	BK-CS2	--|09|10|11|12|13|14|15|16|17|
  MT1006	Giải tích 2 (bài tập) 	--	--	L04	2	5-6	10:00 - 11:50	H1-703	BK-CS2	--|09|10|11|12|13|14|15|16|17|--|19|`;

    $: timetables = parseAndResolveTimetables(raw);

    let i = 0;

    $: timetable = timetables[i];

    const oldTimetable = browser ? loadTimetable() : undefined;

    $: diff =
        oldTimetable && timetable
            ? diffResolvedEntries(oldTimetable.entries, timetable.entries)
            : diffResolvedEntries([], timetable.entries);
</script>

<div class="mx-auto w-full max-w-xl">
    <h1 class="text-center font-display text-4xl text-gray-900">
        <span class="text-blue">BK</span>alendar
    </h1>

    <textarea
        class="mt-6 h-56 w-full max-w-xl rounded-md border-2 border-dashed bg-white outline-none focus:border-blue"
        bind:value={raw}
    />
    <p class="mt-6 text-center text-gray-300">— hoặc —</p>
    <p class="mt-4 text-center font-semibold text-gray-400">
        Tiếp tục với thời khóa biểu cũ
    </p>
</div>

<div class="mx-auto mt-10 w-full max-w-xl">
    <h1 class="text-center">Chọn thời khóa biểu</h1>
    <div class="flex items-center justify-center space-x-4">
        <button
            class="hover:bg-white hover:shadow-sm rounded-sm disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none disabled:text-gray-200"
            on:click={() => i++}
            disabled={i >= timetables.length - 1}
        >
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span class="font-display text-2xl w-40 text-center">Học kỳ {timetable.yearFrom % 100}{timetable.semester}</span>
        <button
            class="hover:bg-white hover:shadow-sm rounded-sm disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none disabled:text-gray-200"
            on:click={() => i--}
            disabled={i <= 0}
        >
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
    </div>
    <div
        class="mt-4 min-h-96 space-y-2 rounded-md bg-white p-8 shadow-md shadow-gray-200"
    >
        {#each diff as { old: oldEntry, new: newEntry }}
            <EntryDiffPreview {newEntry} {oldEntry} />
        {/each}
    </div>
    <button
        class="mx-auto mt-4 flex items-center space-x-1 rounded-md bg-blue px-2 py-1 font-bold text-white shadow-md shadow-blue/20"
    >
        <!-- prettier-ignore -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        <span on:click={() => saveTimetable(timetable)}>Tiếp tục</span>
    </button>
</div>

<div class="mx-auto mt-10 w-full max-w-xl">
    <div
        class="min-h-96 mt-4 mb-10 space-y-6 rounded-md bg-white p-8 shadow-md shadow-gray-200"
    >
        {#each timetable.entries as entry}
            <EntryEdit {entry} />
        {/each}
    </div>
    <div class="flex items-center justify-center space-x-4">
        <div class="relative w-56">
            <label class="absolute left-2 -top-6 text-sm" for="calendar-select">
                Chọn lịch để thêm vào
            </label>
            <Select
                {items}
                {value}
                Icon={CalendarIcon}
                inputAttributes={{ id: "calendar-select" }}
                showChevron={true}
                --borderRadius="6px"
                --selectedItemPadding="0 0 0 0.5rem"
                --inputPadding="0 10px 0 40px"
                --padding="0 1.5rem 0 0.5rem"
            />
        </div>
        <button
            class="flex h-9 items-center space-x-3 overflow-hidden rounded-md bg-blue pr-3 font-bold text-white shadow-md shadow-blue/20 active:shadow-none"
        >
            <div class="h-9 bg-white p-2">
                <!-- prettier-ignore -->
                <svg class="h-full w-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
            </div>
            <span>Đồng bộ</span>
        </button>
    </div>
</div>

<style lang="postcss">
    :root {
        --itemIsActiveBG: theme("colors.blue.DEFAULT");
        --borderFocusColor: theme("colors.blue.DEFAULT");
    }
</style>
