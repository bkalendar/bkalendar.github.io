// this module is intended to be lazy-loaded
// i.e, only import this module on browser

import type { MachineTimetable } from '@bkalendar/core';
import { openDB, type DBSchema } from 'idb/with-async-ittr';

export default { add, getPrev, getLatest };

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
	const cursor = await db
		.transaction('timetables', 'readonly')
		.store.index('by-semester')
		.openCursor([semester.year, semester.semester], 'prev');
	return cursor?.value ?? null;
}

async function getLatest(): Promise<MachineTimetable | null> {
	const cursor = await db.transaction('timetables', 'readonly').store.openCursor(null, 'prev');
	return cursor?.value ?? null;
}
