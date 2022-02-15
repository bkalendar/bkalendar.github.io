import { Entry } from "./Entry";
import { Event } from "./Event";

export class Timetable {
  semester: number;
  year: { from: number; to: number };
  entries: Entry[];

  /**
   * Full timetable with entries and metadata
   */
  constructor(raw: string) {
    const pattern =
      /Học kỳ (?<semester>\d) Năm học (?<yearFrom>\d+) - (?<yearTo>\d+)\n[^\n]*\n[^\n]*\n(?<entries>(?:[^](?!\nTổng số tín chỉ đăng ký))*)/;
    const match = raw.match(pattern);

    if (!match) throw new Error("Invalid input");

    this.semester = Number(match.groups.semester);
    this.year = {
      from: Number(match.groups.yearFrom),
      to: Number(match.groups.yearTo),
    };
    this.entries = [];

    for (const rawEntry of match.groups.entries.split("\n")) {
      try {
        const entry = new Entry(rawEntry.trim());
        this.entries.push(entry);
      } catch {}
    }
  }

  toVCalendar() {
    let arr = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//bkalendar//Google Calendar v1.0/VI",
    ];
    for (const entry of this.entries) {
      arr.push(
        Event.fromEntry(entry, {
          semester: this.semester,
          yearFrom: this.year.from,
          yearTo: this.year.to,
        }).toVEvent()
      );
    }
    arr.push("END:VCALENDAR");
    return arr.join("\r\n");
  }
}
