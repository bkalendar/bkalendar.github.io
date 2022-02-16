import { describe, it, expect } from "vitest";

import { entryToEvent, Event, toVEvent } from "../src/lib/ical";
import { parseEntry } from "../src/lib/Entry";

describe("Event", () => {
    let entry = parseEntry(
        "CO1023	Hệ thống số 	3	3	L01	2	2-4	7:00 - 9:50	H1-201	BK-CS2	--|--|--|42|43|44|--|--|--|--|49|50|--|52|53|01|"
    );

    let event = entryToEvent(entry, {
        semester: 1,
        yearFrom: 2020,
        yearTo: 2021,
    });
    const vevent = toVEvent(event);

    it("should be able to convert simple entry", () => {
        expect(event.start.getUTCHours()).toBe(7 - 7);
        expect(event.start.getUTCDate()).toBe(12);
        expect(event.start.getUTCMonth()).toBe(10 - 1);
        expect(event.end.getUTCHours()).toBe(10 - 7);
        expect(event.repeats[0].getUTCDate()).toBe(12);
        expect(event.repeats[3].getUTCDate()).toBe(30);
    });

    it("should ignore HANGOUT_TUONGTAC room", () => {
        let event = entryToEvent(
            parseEntry(
                "CO1028	Kỹ thuật lập trình (tn) 	--	--	L11	6	8-9	13:00 - 14:50	HANGOUT_TUONGTAC	BK-CS1	--|--|--|--|--|--|--|--|--|--|--|19|20|"
            ),
            { semester: 2, yearFrom: 2020, yearTo: 2021 }
        );

        const vevent = toVEvent(event);
        expect(vevent).not.toContain("LOCATION");

        expect(event.location).toBeUndefined();
    });

    it("should convert to VEVENT correctly", () => {
        // console.log(vevent);
        expect(vevent).toContain("20201019T000000Z");
    });
});
