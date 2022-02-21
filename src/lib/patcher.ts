import type { EntryResolved } from "./entry";

export function patchResolvedEntries(
    oldEntry: EntryResolved,
    newEntry: EntryResolved
): EntryResolved {
    if (oldEntry.hash !== newEntry.hash)
        throw new Error("cannot patch two irrelated entries");
    return {
        ...newEntry,
        name: oldEntry.name,
        meetLink: oldEntry.meetLink,
        colorId: oldEntry.colorId,
    };
}

export function isDifferentResolvedEntries(
    oldEntry: EntryResolved,
    newEntry: EntryResolved
): boolean {
    if (oldEntry.hash !== newEntry.hash)
        throw new Error("cannot compare two irrelated entries");

    if (
        oldEntry.firstWeek != newEntry.firstWeek ||
        oldEntry.lastWeek != newEntry.lastWeek ||
        oldEntry.excludeWeeks.length != newEntry.excludeWeeks.length
    )
        return true;

    for (let i in oldEntry) {
        if (oldEntry.excludeWeeks[i] != newEntry.excludeWeeks[i]) return true;
    }

    return false;
}
