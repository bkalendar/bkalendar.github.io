import { describe, it, expect } from "vitest";
import { Ical } from '../src/lib/ical';

import { parseTimetable } from "../src/lib/Timetable";

describe("Timetable", () => {
    const raw = `Học kỳ 2 Năm học 2020 - 2021
  Ngày cập nhật:2021-07-07 12:38:43.0
  Mã MH	Tên môn học	Tín chỉ	Tc học phí	Nhóm-Tổ	Thứ	Tiết	Giờ học	Phòng	Cơ sở	Tuần học
  CO1007	Cấu trúc rời rạc cho khoa học máy tính 	4	4	L01	2	2-3	7:00 - 8:50	H1-401	BK-CS2	--|09|10|11|12|13|14|15|16|17|
  MT1006	Giải tích 2 (bài tập) 	--	--	L04	2	5-6	10:00 - 11:50	H1-703	BK-CS2	--|09|10|11|12|13|14|15|16|17|--|19|`;

    const timetable = parseTimetable(raw);

    it("can read metadata", () => {
        expect(timetable.semester).toBe(2);
        expect(timetable.year.from).toBe(2020);
        expect(timetable.year.to).toBe(2021);
    });

    it("can read entries", () => {
        expect(timetable.entries[0].id).toBe("CO1007");
        expect(timetable.entries).toHaveLength(2);
        expect(timetable.entries[1].weeks.first).toBe(9);
        expect(timetable.entries[1].weeks.others).toEqual([
            10, 11, 12, 13, 14, 15, 16, 17, 19,
        ]);
    });

    it("excludes falsy entries", () => {
        const raw = `Học kỳ 1 Năm học 2020 - 2021
    Ngày cập nhật:2021-01-14 13:44:46.0
    Mã MH	Tên môn học	Tín chỉ	Tc học phí	Nhóm-Tổ	Thứ	Tiết	Giờ học	Phòng	Cơ sở	Tuần học
    MI1003	Giáo dục quốc phòng 	--	1	L02	--	0-0	0:00 - 0:00	------	BK-CS1	--|--|--|--|--|--|45|46|47|48|
    CO1028	Kỹ thuật lập trình (tn) 	--	--	L11	3	8-9	13:00 - 14:50	HANGOUT_TUONGTAC	BK-CS1	--|`;

        const timetable = parseTimetable(raw);

        expect(timetable.entries).toHaveLength(0);
    });

    it.skip("should convert correctly to VCALENDAR", () => {
        expect(Ical.toVCalendar(timetable)).toContain("20210412T030000Z");
    });
});
