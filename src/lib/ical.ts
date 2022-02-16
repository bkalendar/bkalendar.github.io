import { Entry } from "./Entry";
import { Timetable } from "./Timetable";
import { addWeeks, addDays } from "date-fns";

export class Ical {
    static toVEvent(entry: Entry) {}

    static toVCalendar(timetable: Timetable) {
        let arr = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//bkalendar//Google Calendar v1.0/VI",
        ];
        for (const entry of timetable.entries) {
            arr.push(
                Event.fromEntry(entry, {
                    semester: timetable.semester,
                    yearFrom: timetable.year.from,
                    yearTo: timetable.year.to,
                }).toVEvent()
            );
        }
        arr.push("END:VCALENDAR");
        return arr.join("\r\n");
    }
}

import { v4 as uuid } from "uuid";

interface Info {
    subject: string;
    description: string;
    location: string | undefined;
    start: Date;
    end: Date;
    repeats: Date[];
}

export class Event {
    #uid: string;
    subject: string;
    description: string;
    location: string | undefined;
    start: Date;
    end: Date;
    repeats: Date[];

    constructor(info: Info) {
        this.subject = info.subject;
        this.#uid = uuid();
        this.description = info.description;
        this.location = info.location;
        this.start = info.start;
        this.end = info.end;
        this.repeats = info.repeats;
    }

    /**
     * Turn into VEVENT format (ical specification)
     */
    toVEvent(): string {
        function toIcalDateTime(dt: Date): string {
            return dt.toISOString().replace(/[-:]/g, "");
        }

        return [
            "BEGIN:VEVENT",
            `UID:${this.#uid}`,
            "DTSTAMP:20210928T200000",
            `SUMMARY:${this.subject}`,
            `DESCRIPTION:${this.description}${
                this.location ? `\r\nLOCATION:${this.location}` : ""
            }`,
            `DTSTART:${toIcalDateTime(this.start)}`,
            `DTEND:${toIcalDateTime(this.end)}`,
            `RDATE:${this.repeats.map(toIcalDateTime).join(",")}`,
            "END:VEVENT",
        ].join("\r\n");
    }

    static fromEntry(
        entry,
        metadata: { semester: number; yearFrom: number; yearTo: number }
    ) {
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
            const week1 = new Date(
                Date.UTC(yearOfWeek(week), 1, 4, period - 2)
            );
            const today = addDays(
                addWeeks(week1, week - 1),
                wday - 1 - week1.getUTCDay()
            );

            return today;
        };

        return new Event({
            subject: entry.name,
            description: `Mã môn: ${entry.id}\\nMã lớp: ${entry.group}`,
            location:
                entry.room === "HANGOUT_TUONGTAC" ? undefined : entry.room,
            start: toDateTime(entry.start, entry.wday, entry.weeks.first),
            end: toDateTime(entry.end + 1, entry.wday, entry.weeks.first),
            repeats: [entry.weeks.first]
                .concat(entry.weeks.others)
                .map((week) => toDateTime(entry.start, entry.wday, week)),
        });
    }
}
