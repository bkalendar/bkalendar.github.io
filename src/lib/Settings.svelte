<script lang="ts">
    import type { TimetableResolved } from "./timetable";

    export let timetable: TimetableResolved;
</script>

<div class="space-y-6">
    {#each timetable.entries as entry}
        <label class="block">
            <span class="text-sm">
                {entry.id}, thứ {entry.wday}
            </span>
            <input
                type="text"
                bind:value={entry.name}
                class="block w-full rounded-md border border-blue py-1 px-2 dark:bg-transparent"
            />
        </label>
    {/each}
</div>
