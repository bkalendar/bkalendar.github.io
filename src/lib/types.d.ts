export interface Database {
	add(timetable: MachineTimetable): Promise<void>;
	getPrev(timetable: MachineTimetable): Promise<MachineTimetable | null>;
}
