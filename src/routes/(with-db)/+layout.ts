import { browser } from '$app/env';
import type { Database } from '$lib/types.js';

export const load: import('./$types').LayoutLoad = async () => {
	// default to a no-op database
	let db: Database = {
		add: async () => {},
		getPrev: async () => null
	};

	if (browser) {
		try {
			// open the real indexedDB
			db = await import('./db.js').then((module) => module.default);
		} catch {
			// unsuccessful, maybe inside incognito
			console.warn("indexedDB can't be opened. Features will be limited.");
		}
	}

	return {
		db
	};
};
