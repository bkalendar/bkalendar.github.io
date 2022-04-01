<script lang="ts">
    import { timetableStore, timetableReady } from "$lib/stores/timetable";
    import { userPromise } from "$lib/stores/user";
    import {
        calendarsPromise,
        selectedCalendarPromise,
    } from "$lib/stores/calendar_list";
    import EntryEdit from "$lib/EntryEdit.svelte";
</script>

<div class="mx-auto mt-10 w-full max-w-xl">
    <div
        class="min-h-96 mt-4 mb-10 space-y-6 rounded-md bg-white p-8 shadow-md shadow-gray-200"
    >
        {#await timetableReady}
            <p>Load thời khóa biểu...</p>
        {:then}
            {#if !$timetableStore}
                No timetable
            {:else}
                {#each $timetableStore.entries as entry}
                    <EntryEdit bind:entry />
                {/each}
            {/if}
        {/await}
    </div>
    <!-- {#await Promise.all( [userPromise, selectedCalendarPromise, $calendarsPromise] )}
        <p class="text-center">Kết nối với Google Calendar...</p>
    {:then [user, selected, calendars]}
        <ButtonSync {user} {selected} {calendars} />
    {/await} -->
</div>

<style lang="postcss">
    :root {
        --itemIsActiveBG: theme("colors.blue.DEFAULT");
        --borderFocusColor: theme("colors.blue.DEFAULT");
    }
</style>
