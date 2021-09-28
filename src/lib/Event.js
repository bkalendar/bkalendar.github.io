/// <reference types="@js-temporal/polyfill" />
/** @typedef {Temporal.ZonedDateTime} DateTime*/

import { Temporal } from '@js-temporal/polyfill';
import { v4 as uuid } from 'uuid';

export class Event {
  /**
   * Intermediate class for exporting to ical
   * @param {Object}     info             Event info
   * @param {string}     info.subject     Event name
   * @param {string}     info.description Specific description/notes
   * @param {string}     [info.location]  Location
   * @param {DateTime}   info.start       Datetime start
   * @param {DateTime}   info.end         Datetime end
   * @param {DateTime[]} info.repeats     Date repeats
   */
  constructor(info) {
    /** @type {string} */
    this.subject = info.subject;

    /** @type {string} */
    this.#uid = uuid();

    /** @type {string} */
    this.description = info.description;

    /** @type {string|undefined} */
    this.location = info.location;

    /** @type {DateTime} */
    this.start = info.start;

    /** @type {DateTime} */
    this.end = info.end;

    /** @type {DateTime[]} */
    this.repeats = info.repeats;
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
     * Resolve week to year
     * @param {number} week
     * @returns {number}
     */
    const yearOfWeek = (week) =>
      53 - week < week - 0 ? metadata.yearFrom : metadata.yearTo;

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
      description: `Mã môn: ${entry.id}\nMã lớp: ${entry.group}`,
      location: entry.room === 'HANGOUT_TUONGTAC' ? undefined : entry.room,
      start: toDateTime(entry.start, entry.wday, entry.weeks.first),
      end: toDateTime(entry.end + 1, entry.wday, entry.weeks.first),
      repeats: [entry.weeks.first]
        .concat(entry.weeks.others)
        .map((week) => toDateTime(entry.start, entry.wday, week)),
    });
  }
}
