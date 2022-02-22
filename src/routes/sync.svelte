<script lang="ts">
    import ButtonSync from "../lib/ButtonSync.svelte";

    import EntryEdit from "$lib/EntryEdit.svelte";
    import { loadTimetable } from "$lib/timetable";
    import { browser } from "$app/env";

    $: timetable = browser ? loadTimetable() : undefined;
</script>

<div class="mx-auto mt-10 w-full max-w-xl">
    <div
        class="min-h-96 mt-4 mb-10 space-y-6 rounded-md bg-white p-8 shadow-md shadow-gray-200"
    >
        {#if timetable}
            {#each timetable.entries as entry}
                <EntryEdit {entry} />
            {/each}
        {/if}
    </div>
    <ButtonSync />
</div>

<style lang="postcss">
    :root {
        --itemIsActiveBG: theme("colors.blue.DEFAULT");
        --borderFocusColor: theme("colors.blue.DEFAULT");
    }
</style>
