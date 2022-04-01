import type { SemesterContext } from "./date_utils";
import type { EntryRaw, EntryResolved } from "./entry";
import { parseEntry } from "./entry";
import { resolveTimetables } from "./resolver";

export interface TimetableRaw extends SemesterContext {
    entries: EntryRaw[];
}

export interface TimetableResolved extends SemesterContext {
    entries: EntryResolved[];
    /** 00:00 UTC Monday of the first week */
    start: Date;
    colorId: string;
}

export function parseTimetables(raw: string): TimetableRaw[] {
    const pattern =
        /Học kỳ (?<semester>\d) Năm học (?<yearFrom>\d+) - (?<yearTo>\d+)\n[^\n]*\n[^\n]*\n(?<entries>(?:[^](?!Tổng số tín chỉ đăng ký))*)/g;
    return [...raw.matchAll(pattern)].map((match) => ({
        semester: Number(match.groups!!.semester),
        yearFrom: Number(match.groups!!.yearFrom),
        yearTo: Number(match.groups!!.yearTo),
        entries: match
            .groups!!.entries.split("\n")
            .map((rawEntry) => parseEntry(rawEntry.trim()))
            .filter((rawEntry): rawEntry is EntryRaw => Boolean(rawEntry)),
    }));
}

export function parseAndResolveTimetables(raw: string): TimetableResolved[] {
    return resolveTimetables(parseTimetables(raw));
}
