<script lang="ts">
    import EntryEdit from "./EntryEdit.svelte";
    import type { TimetableStore } from "./stores/timetable";

    export let timetable: TimetableStore;
</script>

{#if !$timetable}
    No timetable
{:else}
    {#each $timetable.entries as entry}
        <EntryEdit {entry} />
    {/each}
{/if}
