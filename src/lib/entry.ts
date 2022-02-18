import { hash } from "object-hash";

interface Common {
    /** hash id from (id, room, wday, start, end) */
    readonly hash: string;
    readonly id: string;
    readonly room: string;
    readonly wday: number;
    readonly start: number;
    readonly end: number;
    group: string;
    name: string;
}

export interface EntryRaw extends Common {
    weeks: number[];
}

export interface EntryResolved extends Common {
    /** offset of week (inclusive) from the first week of semester */
    firstWeek: number;
    /** offset of week (inclusive) fom the first week of semester */
    lastWeek: number;
    /** offset of weeks from the first week of semester */
    excludeWeeks: number[];
}

export function parseEntry(raw: string): EntryRaw | null {
    const pattern =
        /^(?<id>[^\t]*)\t(?<name>[^\t]*)\t[^\t]*\t[^\t]*\t(?<group>[^\t]*)\t(?<wday>\d)\t(?<start>\d+)-(?<end>\d+)\t[^\t]*\t(?<room>[^\t]*)\t[^\t]*\t(?<weeks>.*)$/;
    const match = raw.match(pattern);

    if (!match) return null;

    const required = {
        id: match.groups.id,
        wday: Number(match.groups.wday),
        start: Number(match.groups.start),
        end: Number(match.groups.end),
        room: match.groups.room,
    };

    return {
        ...required,
        hash: hash(required),
        name: match.groups.name.trim(),
        group: match.groups.group,
        weeks: match.groups.weeks.split("|").map(Number),
    };
}

/**
 * Merge two entries. Throw if unidentical, so remember to check the hash before merging.
 * @returns Merged entry
 */
function mergeEntryRaw(entry1: EntryRaw, entry2: EntryRaw): EntryRaw {
    if (entry1.hash != entry2.hash)
        throw new Error("Cannot merge two different entries");

    const newLength = Math.max(entry1.weeks.length, entry2.weeks.length);
    const newWeeks = new Array(newLength);
    for (const i in newWeeks) {
        // keep the truthy values
        newWeeks[i] = entry1.weeks[i] || entry2.weeks[i];
    }

    return {
        ...entry2,
        weeks: newWeeks,
    };
}

export function mergeEntriesRaw(entries: EntryRaw[]) {
    for (let i = 0; i < entries.length - 1; i += 1) {
        if (entries[i].hash == entries[i + 1].hash) {
            entries[i] = mergeEntryRaw(entries[i], entries[i + 1]);
            entries.splice(i + 1, 1);
        }
    }
}
