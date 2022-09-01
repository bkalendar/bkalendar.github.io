import type { MachineTimetable } from '@bkalendar/core';

export interface Database {
	add(timetable: MachineTimetable): Promise<void>;
	getPrev(timetable: MachineTimetable): Promise<MachineTimetable | null>;
	getLatest(): Promise<MachineTimetable | null>;
}

export interface Gapi {
	auth(): Promise<void>;
	createTimetable(timetable: MachineTimetable, options?: { colorIds?: string[] }): Promise<void>;
}

export type EventInput = gapi.client.calendar.EventInput;
