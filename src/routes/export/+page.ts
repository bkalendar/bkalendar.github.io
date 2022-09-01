import { browser } from '$app/environment';
import type { MachineTimetable } from '@bkalendar/core';
import type Gapi from './google';

export const load: import('./$types').PageLoad = async ({ parent }) => {
	const { db } = await parent();
	let latest: MachineTimetable | null = null;
	let google: typeof Gapi = {
		auth: async () => {},
		addEventsToCalendar: async () => {},
		createCalendar: async () => {
			throw '';
		}
	};

	if (browser) {
		latest = await db.getLatest();
		google = await import('./google').then((module) => module.default);
	}

	return {
		title: 'Xuất lịch | BKalendar',
		latest,
		google
	};
};
