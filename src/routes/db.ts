// this module is intended to be lazy-loaded
// i.e, only import this module on browser

import type { Timetable } from '@bkalendar/core';
import { openDB, type DBSchema } from 'idb/with-async-ittr';

export default { add, getPrev, getLatest };

interface Schema extends DBSchema {
	timetables: {
		key: number;
		value: Required<Timetable>;
		indexes: {
			'by-semester': [number];
		};
	};
}

const db = await openDB<Schema>('timetable-snapshots', 1, {
	async upgrade(db, oldVersion) {
		switch (oldVersion) {
			case 0:
				db.createObjectStore('timetables', {
					autoIncrement: true
				}).createIndex('by-semester', ['semester']);
				break;
		}
	}
});

async function add(timetable: Required<Timetable>) {
	await db.put('timetables', timetable);
}

async function getPrev({ semester }: Required<Timetable>): Promise<Required<Timetable> | null> {
	const cursor = await db
		.transaction('timetables', 'readonly')
		.store.index('by-semester')
		.openCursor([semester], 'prev');
	return cursor?.value ?? null;
}

async function getLatest(): Promise<Required<Timetable> | null> {
	const cursor = await db.transaction('timetables', 'readonly').store.openCursor(null, 'prev');
	return cursor?.value ?? null;
}
