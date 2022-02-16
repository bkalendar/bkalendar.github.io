import { Entry, parseEntry } from "./Entry";

export interface Timetable {
    semester: number;
    year: { from: number; to: number };
    entries: Entry[];
}

export function parseTimetable(raw: string): Timetable | null {
    const pattern =
        /Học kỳ (?<semester>\d) Năm học (?<yearFrom>\d+) - (?<yearTo>\d+)\n[^\n]*\n[^\n]*\n(?<entries>(?:[^](?!\nTổng số tín chỉ đăng ký))*)/;
    const match = raw.match(pattern);

    if (!match) return null;
    return {
        semester: Number(match.groups.semester),
        year: {
            from: Number(match.groups.yearFrom),
            to: Number(match.groups.yearTo),
        },
        entries: match.groups.entries
            .split("\n")
            .map((rawEntry) => parseEntry(rawEntry.trim()))
            .filter(Boolean),
    };
}

export function saveTimetable(timetable: Timetable) {
    localStorage.setItem("bkalendar-timetable", JSON.stringify(timetable));
}

export function loadTimetable(): Timetable | null {
    const raw: string | null = localStorage.getItem("bkalendar-timetable");
    return raw && JSON.parse(raw);
}
