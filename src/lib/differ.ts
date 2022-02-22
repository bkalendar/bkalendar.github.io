import type { EntryResolved } from "./entry";
import type { TimetableResolved } from "./timetable";

type Pair<T> =
    | {
          old: T;
          new: T;
      }
    | {
          old: null;
          new: T;
      }
    | {
          old: T;
          new: null;
      };

function extract<T>(pair: Pair<T>): T {
    if (!pair.new) return pair.old;
    return pair.new;
}

export function diffResolvedEntries(
    oldEntries: EntryResolved[],
    newEntries: EntryResolved[]
): Pair<EntryResolved>[] {
    const result: Record<string, Pair<EntryResolved>> = {};
    for (const entry of oldEntries) {
        result[entry.hash] = {
            old: entry,
            new: null,
        };
    }
    for (const entry of newEntries) {
        if (result[entry.hash] === undefined) {
            result[entry.hash] = {
                old: null,
                new: entry,
            };
        } else {
            result[entry.hash].new = entry;
        }
    }
    return Object.values(result).sort((a, b) => {
        const extractA = extract(a);
        const extractB = extract(b);
        if (extractA.wday == extractB.wday)
            return extractA.start - extractB.start;
        return extractA.wday - extractB.wday;
    });
}
