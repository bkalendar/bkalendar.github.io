<script context="module" lang="ts">
    const listFormatter = new Intl.ListFormat("vi-VN");
</script>

<script lang="ts">
    import type { EntryResolved } from "./entry";
    import {
        isDifferentResolvedEntries,
        patchResolvedEntries,
    } from "./patcher";

    export let newEntry: EntryResolved | null;
    export let oldEntry: EntryResolved | null;

    $: patchedEntry =
        newEntry &&
        oldEntry &&
        isDifferentResolvedEntries(oldEntry, newEntry) &&
        patchResolvedEntries(oldEntry, newEntry);

    const yesWeeks = (entry: EntryResolved | null) => {
        if (!entry) return [];
        const result = [];
        for (let i = entry.firstWeek; i <= entry.lastWeek; i += 1) {
            if (!entry.excludeWeeks.includes(i)) result.push(`${i}`);
        }
        return result;
    };
</script>

{#if newEntry && oldEntry}
    {#if patchedEntry}
        <div>
            <p class="bg-yellow-50 p-2 text-yellow-900">
                ⚠️ {patchedEntry.name}
            </p>
            <div class="ml-4 -space-y-1 border-l-2 border-gray-200 pl-4 pt-4">
                <p>
                    👉
                    <span class="relative">
                        <span
                            class="absolute -top-3 text-xs text-gray-400 line-through"
                        >
                            Học tuần {listFormatter.format(yesWeeks(oldEntry))}
                        </span>
                        Học tuần {listFormatter.format(yesWeeks(patchedEntry))}
                    </span>
                </p>
            </div>
        </div>
    {:else}
        <p class="p-2">📖 {newEntry.name}</p>
    {/if}
{:else if newEntry}
    <p class="bg-green-50 p-2 text-green-900">
        📗 {newEntry.name}
    </p>
{:else if oldEntry}
    <p class="bg-red-50 p-2 text-red-900">
        📕 {oldEntry.name}
    </p>
{/if}
