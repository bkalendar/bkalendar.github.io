export class Entry {
  /**
   * Contruct entry from timetable line
   * @param {string} raw
   */
  constructor(raw) {
    const pattern =
      /^(?<id>[^\t]*)\t(?<name>[^\t]*)\t[^\t]*\t[^\t]*\t(?<group>[^\t]*)\t(?<wday>\d)\t(?<start>\d+)-(?<end>\d+)\t[^\t]*\t(?<room>[^\t]*)\t[^\t]*\t(?:--\|)*(?<firstWeek>\d\d)\|(?<otherWeeks>.*)$/;

    const match = raw.match(pattern);

    if (!match) throw new Error('Incorrect format');

    /** @type {string} */
    this.id = match.groups.id;

    /** @type {string} */
    this.name = match.groups.name.trim();

    /** @type {string} */
    this.group = match.groups.group;

    /** @type {number} */
    this.wday = Number(match.groups.wday);

    /** @type {number} */
    this.start = Number(match.groups.start);

    /** @type {number} */
    this.end = Number(match.groups.end);

    /** @type {number} */
    this.room = match.groups.room;

    /** @type {{first: number, others: number[]}} */
    this.weeks = {
      first: Number(match.groups.firstWeek),
      others: match.groups.otherWeeks.split('|').map(Number).filter(Boolean),
    };
  }
}
