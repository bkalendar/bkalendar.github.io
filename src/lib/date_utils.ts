import { addDays, addHours, addWeeks } from "date-fns";

export interface SemesterContext {
    semester: number;
    yearFrom: number;
    yearTo: number;
}

/**
 * Here we use a simple algorithm for resolving year of week:
 *
 * - If summer (`semester == 3`), definitely second half of school year
 * - Else, decide base on how late it is into the year
 *   (26-53 is first half, 1-26 is second half)
 *
 * @param firstWeek first week
 * @param context semester and school years context (e.g semester 2 year 2021-2022)
 * @returns `timetable.yearFrom` or `timetable.yearTo`
 */
function yearOfStartWeek(firstWeek: number, context: SemesterContext): number {
    // summer semester, definitely yearTo?
    if (context.semester == 3) return context.yearTo;
    // first half of year
    if (2 * firstWeek > 53) return context.yearFrom;
    // second half of year
    return context.yearTo;
}

/**
 * Resolve first date of weeks.
 *
 * **Example**: with weeks `[--, 50, --, --, --, 2, 3]` on 2021-2022 semester 2,
 * this will resolve to week 49 of 2021
 *
 * @param weeks
 * @param context semester, school years context
 * @returns first date of `weeks` param
 */
export function resolveFirstDate(
    weeks: number[],
    context: SemesterContext
): Date {
    let i = weeks.findIndex(Boolean);
    if (i == -1) throw new Error("Empty weeks");

    const week = weeks[i];

    // get closer to beginning of semester for more accurate week1
    let closerWeek = week - i;
    if (closerWeek <= 0)
        // whoops, best we can do is 1
        closerWeek = 1;

    const week1 = new Date(
        Date.UTC(yearOfStartWeek(closerWeek, context), 0, 4)
    );

    // shift Sun..Sar to Mon..Sun (0..6 to 2..8)
    const wday = ((week1.getUTCDay() + 6) % 7) + 2;

    let date = week1;
    // correct week shift
    date = addWeeks(date, week - i - 1);
    // monday shift
    date = addDays(date, 2 - wday);

    return date;
}

/**
 * Generate correct date based on start date and offsets
 * @returns date and time object for `ics` package in UTC
 */
export function resolveDate(
    start: Date,
    weekOffset: number,
    weekday: number,
    period: number
): Date {
    let date = start;
    date = addWeeks(date, weekOffset);
    date = addDays(date, weekday - 2);
    date = addHours(date, period - 2);
    return date;
}
