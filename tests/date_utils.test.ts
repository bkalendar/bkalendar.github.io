import { it, expect } from "vitest";
import { SemesterContext, resolveFirstDate } from "../src/lib/date_utils";
import { getISOWeek } from "date-fns";

it("work normally", () => {
    const context: SemesterContext = {
        semester: 2,
        yearFrom: 2021,
        yearTo: 2022,
    };
    const firstDate = resolveFirstDate([NaN, 50, NaN, NaN, NaN, 2, 3], context);
    expect(getISOWeek(firstDate)).toBe(49);
    expect(firstDate.getUTCDay()).toBe(1);
});

it("works with 53-year", () => {
    const context: SemesterContext = {
        semester: 1,
        yearFrom: 2020,
        yearTo: 2021,
    };
    const firstDate = resolveFirstDate([NaN, NaN, NaN, NaN, NaN, 3], context);
    expect(getISOWeek(firstDate)).toBe(51);
    expect(firstDate.getUTCDay()).toBe(1);
});
