import { Entry } from './Entry.js';
import { Event } from './Event.js';

export class Timetable {
  /**
   * Full timetable with entries and metadata
   * @param {string} raw
   */
  constructor(raw) {
    const pattern =
      /Học kỳ (?<semester>\d) Năm học (?<yearFrom>\d+) - (?<yearTo>\d+)\n[^\n]*\n[^\n]*\n(?<entries>(?:[^](?!\nTổng số tín chỉ đăng ký))*)/;
    const match = raw.match(pattern);

    if (!match) throw new Error('Invalid input');

    /** @type {number} */
    this.semester = Number(match.groups.semester);

    /** @type {{ from: number, to: number }} */
    this.year = {
      from: Number(match.groups.yearFrom),
      to: Number(match.groups.yearTo),
    };

    /** @type {Entry[]} */
    this.entries = [];

    for (const rawEntry of match.groups.entries.split('\n')) {
      try {
        const entry = new Entry(rawEntry.trim());
        this.entries.push(entry);
      } catch {}
    }
  }

  toVCalendar() {
    let arr = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//bkalendar//Google Calendar v1.0/VI',
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
    arr.push('END:VCALENDAR');
    return arr.join('\r\n');
  }
}
