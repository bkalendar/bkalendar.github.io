import hash from "object-hash";

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
        /^(?<id>[^\t]*)\t(?<name>[^\t]*)\t[^\t]*\t[^\t]*\t(?<group>[^\t]*)\t(?<wday>\d)\t(?<start>\d+)-(?<end>\d+)\t[^\t]*\t(?<room>[^\t]*)\t[^\t]*\t(?<weeks>.*)\|$/;
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
        hash: hash(required, { algorithm: "md5" }),
        name: match.groups.name.trim(),
        group: match.groups.group,
        weeks: match.groups.weeks.split("|").map(Number),
    };
}

/**
 * Merge two entries. Throw if unidentical, so remember to check the hash before merging.
 * @returns Merged entry
 */
function mergeEntryResolved(
    entry1: EntryResolved,
    entry2: EntryResolved
): EntryResolved {
    if (entry1.hash != entry2.hash)
        throw new Error("Cannot merge two different entries");

    let exclude1 = [...entry1.excludeWeeks, false];
    let exclude2 = [...entry2.excludeWeeks, false];
    for (let i = exclude1.length; i < exclude2.length; i += 1) {
        exclude1.push(i);
    }
    for (let i = exclude2.length; i < exclude1.length; i += 1) {
        exclude2.push(i);
    }
    // console.log(exclude1, exclude2);

    let sortedWeeks = [];
    for (
        let i = 0;
        i < Math.max(entry1.excludeWeeks.length, entry2.excludeWeeks.length);
        i += 1
    ) {
        if (exclude1[i] !== false && exclude2[i] !== false) sortedWeeks.push(i);
    }

    return {
        ...entry2,
        firstWeek: Math.min(entry1.firstWeek, entry2.firstWeek),
        lastWeek: Math.max(entry1.lastWeek, entry2.lastWeek),
        excludeWeeks: sortedWeeks,
    };
}

export function mergeEntriesResolved(entries: EntryResolved[]) {
    for (let i = 0; i < entries.length; i += 1) {
        if (entries[i].hash == entries[i + 1]?.hash) {
            entries[i] = mergeEntryResolved(entries[i], entries[i + 1]);
            entries.splice(i + 1, 1);
        }
        entries[i].excludeWeeks = entries[i].excludeWeeks.filter(
            (x: number | false) => x !== false
        );
    }
}
