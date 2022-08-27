import { browser } from '$app/env';
import type { Database, Gapi } from '$lib/types.js';

export const load: import('./$types.js').LayoutLoad = async () => {
	// default to no-op functions
	// human interactions is required to use the functions
	// so it's ok
	let db: Database = {
		add: async () => {},
		getPrev: async () => null
	};
	let google: Gapi = {
		auth: async () => {},
		createTimetable: async () => {}
	};

	if (browser) {
		try {
			// open the real indexedDB
			db = await import('./db.js').then((module) => module.default);
			google = await import('./google.js').then((module) => module.default);
		} catch {
			// unsuccessful, maybe inside incognito
			console.warn("indexedDB can't be opened. Features will be limited.");
		}
	}

	return {
		db,
		google
	};
};
