export interface Entry {
    id: string;
    name: string;
    group: string;
    wday: number;
    start: number;
    end: number;
    room: string;
    weeks: { first: number; others: number[] };
}

export function parseEntry(raw: string): Entry | null {
    const pattern =
        /^(?<id>[^\t]*)\t(?<name>[^\t]*)\t[^\t]*\t[^\t]*\t(?<group>[^\t]*)\t(?<wday>\d)\t(?<start>\d+)-(?<end>\d+)\t[^\t]*\t(?<room>[^\t]*)\t[^\t]*\t(?:--\|)*(?<firstWeek>\d\d)\|(?<otherWeeks>.*)$/;
    const match = raw.match(pattern);

    if (!match) return null;

    return {
        id: match.groups.id,
        name: match.groups.name.trim(),
        group: match.groups.group,
        wday: Number(match.groups.wday),
        start: Number(match.groups.start),
        end: Number(match.groups.end),
        room: match.groups.room,
        weeks: {
            first: Number(match.groups.firstWeek),
            others: match.groups.otherWeeks
                .split("|")
                .map(Number)
                .filter(Boolean),
        },
    };
}
