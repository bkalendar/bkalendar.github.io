import { describe, it, expect } from "vitest";
import { parseEntry } from "../src/lib/entry";
import { parseTimetables } from "../src/lib/timetable";
import * as fs from "fs";

describe("Entry", () => {
    it("can construct normal entry", () => {
        const entry = parseEntry(
            "CO1023	Hệ thống số 	3	3	L01	2	2-4	7:00 - 9:50	H1-201	BK-CS2	--|--|--|42|43|44|--|--|--|--|49|50|--|52|53|01|"
        );

        expect(entry.id).toBe("CO1023");
        expect(entry.name).toBe("Hệ thống số");
        expect(entry.group).toBe("L01");
        expect(entry.wday).toBe(2);
        expect(entry.start).toBe(2);
        expect(entry.end).toBe(4);
        expect(entry.room).toBe("H1-201");
        // console.log(entry.weeks)
        expect(entry.weeks).toHaveLength(16);
        expect(entry.weeks.filter(Boolean)).toEqual([
            42, 43, 44, 49, 50, 52, 53, 1,
        ]);
    });

    it("can construct normal entry 2", () => {
        const entry = parseEntry(
            "MT1004	Giải tích 1 (bài tập) 	--	--	L44	5	10-11	15:00 - 16:50	H1-103	BK-CS2	--|--|--|42|43|44|--|--|--|--|49|50|--|52|53|01|02|03|"
        );

        expect(entry.id).toBe("MT1004");
        expect(entry.start).toBe(10);
        expect(entry.weeks).toContain(42);
        expect(entry.weeks).toContain(1);
    });

    it("can construct normal entry 3", () => {
        const entry = parseEntry(
            "CH1003	Hóa đại cương 	3	3	L14	3	10-12	15:00 - 17:50	H2-301	BK-CS2	--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|23|"
        );

        expect(entry.weeks).toContain(23);
        expect(entry.weeks.filter(Boolean)).toHaveLength(1);
    });

    it("can construct normal entry 4", () => {
        const entry = parseEntry(
            "CO2004	CTRUC DULIEU &G/THUAT(TH	--	--	L02	8	7-11	12:00 - 16:50	HANGOUT_TUONGTAC	BK-CS1	--|--|--|36|--|38|--|40|--|42|--|44|--|46|"
        );
        expect(entry).not.toBeNull();
    });

    it("throws on invalid format", () => {
        let entry = parseEntry("");

        expect(entry).toBeNull();

        entry = parseEntry(
            "MI1003	Giáo dục quốc phòng 	--	2	L02	--	0-0	0:00 - 0:00	------	BK-CS1	--|--|--|--|--|--|45|46|47|48|"
        );

        expect(entry).toBeNull();

        // entry = parseEntry(
        //     "CH1004	Hóa đại cương (thí nghiệm) 	--	--	L56	4	2-5	7:00 - 10:50	H1-504	BK-CS2	--|"
        // );

        // expect(entry).toBeNull();
    });
});

describe("Timetable", () => {
    const raw = `Học kỳ 2 Năm học 2020 - 2021
  Ngày cập nhật:2021-07-07 12:38:43.0
  Mã MH	Tên môn học	Tín chỉ	Tc học phí	Nhóm-Tổ	Thứ	Tiết	Giờ học	Phòng	Cơ sở	Tuần học
  CO1007	Cấu trúc rời rạc cho khoa học máy tính 	4	4	L01	2	2-3	7:00 - 8:50	H1-401	BK-CS2	--|09|10|11|12|13|14|15|16|17|
  MT1006	Giải tích 2 (bài tập) 	--	--	L04	2	5-6	10:00 - 11:50	H1-703	BK-CS2	--|09|10|11|12|13|14|15|16|17|--|19|`;

    const timetables = parseTimetables(raw);

    expect(timetables).toHaveLength(1);
    const timetable = timetables[0];

    it("can read context", () => {
        expect(timetable.semester).toBe(2);
        expect(timetable.yearFrom).toBe(2020);
        expect(timetable.yearTo).toBe(2021);
    });

    it("can read entries", () => {
        expect(timetable.entries[0].id).toBe("CO1007");
        expect(timetable.entries).toHaveLength(2);
        expect(timetable.entries[1].weeks).toHaveLength(12);
        expect(timetable.entries[1].weeks.filter(Boolean)).toEqual([
            9, 10, 11, 12, 13, 14, 15, 16, 17, 19,
        ]);
    });

    it("excludes falsy entries", () => {
        const raw = `Học kỳ 1 Năm học 2020 - 2021
    Ngày cập nhật:2021-01-14 13:44:46.0
    Mã MH	Tên môn học	Tín chỉ	Tc học phí	Nhóm-Tổ	Thứ	Tiết	Giờ học	Phòng	Cơ sở	Tuần học
    MI1003	Giáo dục quốc phòng 	--	1	L02	--	0-0	0:00 - 0:00	------	BK-CS1	--|--|--|--|--|--|45|46|47|48|
    CO1028	Kỹ thuật lập trình (tn) 	--	--	L11	3	8-9	13:00 - 14:50	HANGOUT_TUONGTAC	BK-CS1	--|`;

        const timetables = parseTimetables(raw);
        expect(timetables).toHaveLength(1);
        const timetable = timetables[0];
        expect(timetable.entries).toHaveLength(1);
    });

    it("can read multiple timetables", () => {
        const FULL_PAGE = fs.readFileSync("./tests/fixtures/full_page.txt", {
            encoding: "utf8",
        });
        const timetables = parseTimetables(FULL_PAGE);
        expect(timetables).toHaveLength(3);
        expect(timetables[1].entries).toHaveLength(22);
        expect(timetables[0].entries).toHaveLength(12);
    });
});
