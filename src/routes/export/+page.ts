import { browser } from '$app/environment';
import type { Gapi } from '$lib/types';
import type { MachineTimetable } from '@bkalendar/core';
import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageLoad = async ({ parent }) => {
	const { db } = await parent();
	let latest: MachineTimetable | null = null;
	let google: Gapi = {
		auth: async () => {},
		createTimetable: async () => {}
	};

	if (browser) {
		latest = await db.getLatest();
		google = await import('./google').then((module) => module.default);
	}

	return {
		latest
	};
};
