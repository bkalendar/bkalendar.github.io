import { Entry } from "./entry";
import { Timetable } from "./timetable";
import { addWeeks, addDays, format } from "date-fns";
import { v4 as uuid } from "uuid";

export function toVCalendar(timetable: Timetable) {
    let arr = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//bkalendar//Google Calendar v1.0/VI",
    ];
    for (const entry of timetable.entries) {
        arr.push(
            toVEvent(
                entryToEvent(entry, {
                    semester: timetable.semester,
                    yearFrom: timetable.year.from,
                    yearTo: timetable.year.to,
                })
            )
        );
    }
    arr.push("END:VCALENDAR");
    return arr.join("\r\n");
}

export function toVEvent(event: Event): string {
    function toIcalDateTime(dt: Date): string {
        return dt.toISOString().replace(/[-:]/g, "").slice(0, -5) + "Z";
    }

    return [
        "BEGIN:VEVENT",
        `UID:${event.uid}`,
        "DTSTAMP:20210928T200000",
        `SUMMARY:${event.subject}`,
        `DESCRIPTION:${event.description}${
            event.location ? `\r\nLOCATION:${event.location}` : ""
        }`,
        `DTSTART:${toIcalDateTime(event.start)}`,
        `DTEND:${toIcalDateTime(event.end)}`,
        `RDATE:${event.repeats.map(toIcalDateTime).join(",")}`,
        "END:VEVENT",
    ].join("\r\n");
}

export interface Event {
    uid: string;
    subject: string;
    description: string;
    location: string | undefined;
    start: Date;
    end: Date;
    repeats: Date[];
}

export function entryToEvent(
    entry: Entry,
    metadata: { semester: number; yearFrom: number; yearTo: number }
): Event {
    /**
     * Resolve week to year.
     * - If it's summer semester, it's definitely yearTo
     * - Else, get the closest year
     */
    const yearOfWeek = (week: number) =>
        metadata.semester == 3
            ? metadata.yearTo
            : 53 - week < week - 0
            ? metadata.yearFrom
            : metadata.yearTo;

    const toDateTime = (period, wday, week) => {
        const week1 = new Date(Date.UTC(yearOfWeek(week), 0, 4, period - 2));
        let week1Wday = ((week1.getUTCDay() + 6) % 7) + 2;
        const today = addDays(addWeeks(week1, week - 1), wday - week1Wday);
        // console.log(today);

        return today;
    };

    return {
        uid: uuid(),
        subject: entry.name,
        description: `Mã môn: ${entry.id}\\nMã lớp: ${entry.group}`,
        location: entry.room === "HANGOUT_TUONGTAC" ? undefined : entry.room,
        start: toDateTime(entry.start, entry.wday, entry.weeks.first),
        end: toDateTime(entry.end + 1, entry.wday, entry.weeks.first),
        repeats: [entry.weeks.first]
            .concat(entry.weeks.others)
            .map((week) => toDateTime(entry.start, entry.wday, week)),
    };
}
