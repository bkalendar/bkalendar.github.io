<script lang="ts">
    import ButtonSync from "../lib/ButtonSync.svelte";

    import EntryEdit from "$lib/EntryEdit.svelte";
    import { browser } from "$app/env";
    import { timetablePromise } from "$lib/stores/timetable";
    import TimetableEdit from "$lib/TimetableEdit.svelte";
    import { userPromise } from "$lib/stores/user";
    import {
        calendarsPromise,
        selectedCalendarPromise,
    } from "$lib/stores/calendar_list";
</script>

<div class="mx-auto mt-10 w-full max-w-xl">
    <div
        class="min-h-96 mt-4 mb-10 space-y-6 rounded-md bg-white p-8 shadow-md shadow-gray-200"
    >
        {#await timetablePromise}
            <p>Load thời khóa biểu...</p>
        {:then timetable}
            <TimetableEdit {timetable} />
        {/await}
    </div>
    {#await Promise.all( [userPromise, selectedCalendarPromise, $calendarsPromise] )}
        <p class="text-center">Kết nối với Google Calendar...</p>
    {:then [user, selected, calendars]}
        <ButtonSync {user} {selected} {calendars} />
    {/await}
</div>

<style lang="postcss">
    :root {
        --itemIsActiveBG: theme("colors.blue.DEFAULT");
        --borderFocusColor: theme("colors.blue.DEFAULT");
    }
</style>
