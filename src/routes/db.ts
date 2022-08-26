// this module is intended to be lazy-loaded
// i.e, only import this module on browser

import type { MachineTimetable } from '@bkalendar/core';
import { openDB, type DBSchema } from 'idb/with-async-ittr';

export default { add, getPrev };

interface Schema extends DBSchema {
	timetables: {
		key: number;
		value: MachineTimetable;
		indexes: {
			'by-semester': [number, number];
		};
	};
}

const db = await openDB<Schema>('timetable-snapshots', 1, {
	async upgrade(db, oldVersion) {
		switch (oldVersion) {
			case 0:
				db.createObjectStore('timetables', {
					autoIncrement: true
				}).createIndex('by-semester', ['semester.year', 'semester.semester']);
				break;
		}
	}
});

async function add(timetable: MachineTimetable) {
	await db.put('timetables', timetable);
}

async function getPrev({ semester }: MachineTimetable): Promise<MachineTimetable | null> {
	for await (const { value: timetable } of db
		.transaction('timetables', 'readonly')
		.store.index('by-semester')
		.iterate([semester.year, semester.semester], 'prev')) {
		return timetable;
	}
	return null;
}
