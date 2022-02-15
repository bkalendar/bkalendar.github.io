export class Entry {
  id: string;
  name: string;
  group: string;
  wday: number;
  start: number;
  end: number;
  room: string;
  weeks: { first: number; others: number[] };

  /**
   * Contruct entry from timetable line
   */
  constructor(raw: string) {
    const pattern =
      /^(?<id>[^\t]*)\t(?<name>[^\t]*)\t[^\t]*\t[^\t]*\t(?<group>[^\t]*)\t(?<wday>\d)\t(?<start>\d+)-(?<end>\d+)\t[^\t]*\t(?<room>[^\t]*)\t[^\t]*\t(?:--\|)*(?<firstWeek>\d\d)\|(?<otherWeeks>.*)$/;

    const match = raw.match(pattern);

    if (!match) throw new Error("Incorrect format");

    this.id = match.groups.id;
    this.name = match.groups.name.trim();
    this.group = match.groups.group;
    this.wday = Number(match.groups.wday);
    this.start = Number(match.groups.start);
    this.end = Number(match.groups.end);
    this.room = match.groups.room;
    this.weeks = {
      first: Number(match.groups.firstWeek),
      others: match.groups.otherWeeks.split("|").map(Number).filter(Boolean),
    };
  }
}
