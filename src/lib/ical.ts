import type { EntryResolved } from "./entry";
import type { TimetableResolved } from "./timetable";
import { resolveDate } from "./date_utils";
import * as ics from "ics";
import { addHours } from "date-fns";
import * as rrule from "rrule";

export function toVCalendar(timetable: TimetableResolved): string {
    let calendar = ics.createEvents(
        timetable.entries.map((entry) => entryToEvent(entry, timetable.start))
    );
    return calendar.value!!.replaceAll(
        /DTSTART:([^Z]+)Z/g,
        "DTSTART;TZID=Asia/Ho_Chi_Minh:$1"
    );
}

export function decomposeDate(
    date: Date
): [number, number, number, number, number] {
    date = addHours(date, 7);
    return [
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        date.getUTCHours(),
        0,
    ];
}

function entryToEvent(entry: EntryResolved, start: Date): ics.EventAttributes {
    const rruleSet = new rrule.RRuleSet();
    rruleSet.rrule(
        new rrule.RRule({
            freq: rrule.RRule.WEEKLY,
            byweekday: entry.wday - 2,
            until: resolveDate(start, entry.lastWeek, entry.wday, entry.start),
        })
    );
    entry.excludeWeeks.forEach((week) =>
        rruleSet.exdate(resolveDate(start, week, entry.wday, entry.start))
    );

    return {
        productId: "iceghost/bkalendar",
        uid: entry.hash + "@bkalendar",
        title: entry.name,
        description: `Mã môn: ${entry.id}\\nMã lớp: ${entry.group}`,
        location: entry.room === "HANGOUT_TUONGTAC" ? undefined : entry.room,
        start: decomposeDate(
            resolveDate(start, entry.firstWeek, entry.wday, entry.start)
        ),
        duration: {
            hours: entry.end - entry.start + 1,
        },
        startInputType: "utc",
        startOutputType: "utc",
        recurrenceRule: rruleSet.valueOf().join("\r\n").slice(6),
    };
}
