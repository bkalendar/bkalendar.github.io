import type { SemesterContext } from "./date_utils";
import type { EntryRaw, EntryResolved } from "./entry";
import { resolveFirstDate } from "./date_utils";
import { mergeEntriesResolved, parseEntry } from "./entry";

export interface TimetableRaw extends SemesterContext {
    entries: EntryRaw[];
}

export interface TimetableResolved extends SemesterContext {
    entries: EntryResolved[];
    /** 00:00 UTC Monday of the first week */
    start: Date;
}

export function parseTimetables(raw: string): TimetableRaw[] {
    const pattern =
        /Học kỳ (?<semester>\d) Năm học (?<yearFrom>\d+) - (?<yearTo>\d+)\n[^\n]*\n[^\n]*\n(?<entries>(?:[^](?!Tổng số tín chỉ đăng ký))*)/g;
    return [...raw.matchAll(pattern)].map((match) => ({
        semester: Number(match.groups.semester),
        yearFrom: Number(match.groups.yearFrom),
        yearTo: Number(match.groups.yearTo),
        entries: match.groups.entries
            .split("\n")
            .map((rawEntry) => parseEntry(rawEntry.trim()))
            .filter(Boolean),
    }));
}

export function resolveTimetables(
    timetableRaws: TimetableRaw[]
): TimetableResolved[] {
    const newTimetables: TimetableResolved[] = [];
    let allOrphans: EntryRaw[] = [];

    for (const timetable of timetableRaws) {
        let firstDate = commonFirstDate(timetable);
        const { resolved, orphans } = resolveEntries(timetable, firstDate);
        newTimetables.push({
            ...timetable,
            entries: resolved,
            start: firstDate,
        });
        allOrphans.push(...orphans);
    }
    for (const timetable of newTimetables) {
        let rawTimetable: TimetableRaw = { ...timetable, entries: allOrphans };
        const { resolved, orphans } = resolveEntries(
            rawTimetable,
            timetable.start
        );
        allOrphans = orphans;
        timetable.entries.push(...resolved);
        timetable.entries.sort((a, b) => {
            let diff = a.wday - b.wday;
            if (diff === 0) diff = a.start - b.start;
            return diff;
        });
        mergeEntriesResolved(timetable.entries);
    }

    if (allOrphans.length != 0) {
        console.warn("Found orphan(s):", allOrphans);
    }

    return newTimetables;
}

function commonFirstDate(timetable: TimetableRaw): Date {
    const multiset: Record<number, number> = {};
    for (const entry of timetable.entries) {
        // we can do nothing with empty weeks
        if (entry.weeks.find(Boolean) === undefined) continue;
        const firstDate = resolveFirstDate(entry.weeks, timetable);
        // get or init 0
        const currentCount = multiset[+firstDate] || 0;
        multiset[+firstDate] = currentCount + 1;
    }
    // NOTE: potentially empty multiset?
    const maxCount = Math.max(...Object.values(multiset));
    const maxKey = Object.entries(multiset).find(
        ([_, count]) => count == maxCount
    )[0];
    return new Date(Number(maxKey));
}

function resolveEntries(
    timetable: TimetableRaw,
    start: Date
): {
    resolved: EntryResolved[];
    orphans: EntryRaw[];
} {
    const resolved: EntryResolved[] = [];
    const orphans: EntryRaw[] = [];
    for (const entry of timetable.entries) {
        // empty weeks, huh?
        if (entry.weeks.find(Boolean) === undefined) {
            console.warn("Discard entry without weeks", entry);
            continue;
        }
        const firstDate = resolveFirstDate(entry.weeks, timetable);
        if (+start === +firstDate) {
            const firstWeek = entry.weeks.findIndex(Boolean);
            const lastWeek = entry.weeks.length - 1;
            resolved.push({
                ...entry,
                firstWeek,
                lastWeek,
                excludeWeeks: entry.weeks
                    // get indices of only falsy weeks
                    .map((n, i) => isNaN(n) && i),
                // slice to make firstWeek first element
                // .slice(firstWeek)
                // filter out truthy weeks
                // .filter(Boolean),
                // NOTE: above logic moved to entry merging process
            });
        } else {
            orphans.push(entry);
        }
    }
    return { resolved, orphans };
}

export function saveTimetable(timetable: TimetableResolved) {
    localStorage.setItem("bkalendar-timetable", JSON.stringify(timetable));
}

export function loadTimetable(): TimetableResolved | null {
    const raw: string | null = localStorage.getItem("bkalendar-timetable");
    return raw && JSON.parse(raw);
}
