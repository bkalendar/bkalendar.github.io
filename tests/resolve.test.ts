import { assert, describe, expect, it } from "vitest";
import fs from "fs";
import { parseAndResolveTimetables } from "../src/lib/timetable";
import { toVCalendar } from "../src/lib/ical";

describe("merge entries", () => {
    const raw = `Học kỳ 1 Năm học 2021 - 2022
Ngày cập nhật:2021-12-22 10:41:38.0
Mã MH	Tên môn học	Tín chỉ	Tc học phí	Nhóm-Tổ	Thứ	Tiết	Giờ học	Phòng	Cơ sở	Tuần học
MT2013	XAC SUAT VA THONG KE	4	4	L11	2	8-10	13:00 - 15:50	HANGOUT_TUONGTAC	BK-CS1	--|34|--|--|--|--|39|
MT2013	XAC SUAT VA THONG KE	4	4	L11	2	8-10	13:00 - 15:50	HANGOUT_TUONGTAC	BK-CS1	--|--|--|--|37|38|--|40|41|--|43|44|
Tổng số tín chỉ đăng ký: 21`;
    const timetable = parseAndResolveTimetables(raw)[0];
    it("correct merge", () => {
        expect(timetable.entries[0].excludeWeeks).toEqual([0, 2, 3, 9]);
    });
});

describe("integrated test", () => {
    it("full calendar", () => {
        const FULL_PAGE = fs.readFileSync("./tests/fixtures/full_page.txt", {
            encoding: "utf8",
        });
        const timetables = parseAndResolveTimetables(FULL_PAGE);
        const timetable = timetables[0];
        // console.log(toVCalendar(timetable));
        assert(timetable.entries.find((entry) => entry.id === "PE1043"));
    });

    it("small calendar", () => {
        const raw = `Học kỳ 2 Năm học 2020 - 2021
  Ngày cập nhật:2021-07-07 12:38:43.0
  Mã MH	Tên môn học	Tín chỉ	Tc học phí	Nhóm-Tổ	Thứ	Tiết	Giờ học	Phòng	Cơ sở	Tuần học
  CO1007	Cấu trúc rời rạc cho khoa học máy tính 	4	4	L01	2	2-3	7:00 - 8:50	H1-401	BK-CS2	--|09|10|11|12|13|14|15|16|17|
  MT1006	Giải tích 2 (bài tập) 	--	--	L04	2	5-6	10:00 - 11:50	H1-703	BK-CS2	--|09|10|11|12|13|14|15|16|17|--|19|`;
        const timetable = parseAndResolveTimetables(raw)[0];
        const vcal = toVCalendar(timetable);
        // console.log(vcal);
        expect(vcal).toContain("20210301T100000");
    });
});
