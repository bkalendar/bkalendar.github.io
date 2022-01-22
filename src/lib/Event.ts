type DateTime = Temporal.ZonedDateTime;

import { Temporal } from '@js-temporal/polyfill';
import { v4 as uuid } from 'uuid';

interface Info {
  subject: string;
  description: string;
  location: string | undefined;
  start: DateTime;
  end: DateTime;
  repeats: DateTime[];
}

export class Event {
  #uid: string;
  subject: string;
  description: string;
  location: string | undefined;
  start: DateTime;
  end: DateTime;
  repeats: DateTime[];

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
    function toIcalDateTime(dt: DateTime): string {
      return dt.toInstant().toString().replace(/[-:]/g, '');
    }

    return [
      'BEGIN:VEVENT',
      `UID:${this.#uid}`,
      'DTSTAMP:20210928T200000',
      `SUMMARY:${this.subject}`,
      `DESCRIPTION:${this.description}${
        this.location ? `\r\nLOCATION:${this.location}` : ''
      }`,
      `DTSTART:${toIcalDateTime(this.start)}`,
      `DTEND:${toIcalDateTime(this.end)}`,
      `RDATE:${this.repeats.map(toIcalDateTime).join(',')}`,
      'END:VEVENT',
    ].join('\r\n');
  }

  /**
   * Construct from entry
   * @param {import('./Entry').Entry} entry
   * @param {Object} metadata
   * @param {number} metadata.semester
   * @param {number} metadata.yearFrom
   * @param {number} metadata.yearTo
   */
  static fromEntry(entry, metadata) {
    /**
     * Resolve week to year.
     * - If it's summer semester, it's definitely yearTo
     * - Else, get the closest year
     * @param {number} week
     * @returns {number}
     */
    const yearOfWeek = (week) =>
      metadata.semester == 3
        ? metadata.yearTo
        : 53 - week < week - 0
        ? metadata.yearFrom
        : metadata.yearTo;

    /**
     *
     * @param {number} period
     * @param {number} week
     * @returns {DateTime}
     */
    const toDateTime = (period, wday, week) => {
      const week1 = Temporal.PlainDate.from({
        year: yearOfWeek(week),
        month: 1,
        day: 4,
      });
      const today = week1
        .add({ weeks: week - 1 })
        .add({ days: wday - 1 - week1.dayOfWeek });

      return today.toZonedDateTime({
        timeZone: Temporal.TimeZone.from('Asia/Saigon'),
        plainTime: Temporal.PlainTime.from({ hour: period + 5 }),
      });
    };

    return new Event({
      subject: entry.name,
      description: `Mã môn: ${entry.id}\\nMã lớp: ${entry.group}`,
      location: entry.room === 'HANGOUT_TUONGTAC' ? undefined : entry.room,
      start: toDateTime(entry.start, entry.wday, entry.weeks.first),
      end: toDateTime(entry.end + 1, entry.wday, entry.weeks.first),
      repeats: [entry.weeks.first]
        .concat(entry.weeks.others)
        .map((week) => toDateTime(entry.start, entry.wday, week)),
    });
  }
}
