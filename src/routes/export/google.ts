// this module should be lazy-loaded (on browser)

import type { EventInput } from '$lib/types';
import { transformGAPI, type MachineTimetable } from '@bkalendar/core';

export default { auth, createCalendar, addEventsToCalendar };

const API_KEY: string = 'AIzaSyBB2fk24uJrAXx_Q7DVPD0XdzUZ6xaFbRI';
const CLIENT_ID: string =
	'1003739652458-kgklao4co5lrtffceqeq8ng2m7m1pde6.apps.googleusercontent.com';

await Promise.all([initGapi(), initGsi()]);

function initGapi() {
	return new Promise<void>((resolve) => {
		const script = document.createElement('script');
		script.src = 'https://apis.google.com/js/api.js';
		script.defer = true;
		script.onload = () => {
			gapi.load('client', async () => {
				await gapi.client.init({
					apiKey: API_KEY,
					discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
				});
				script.onload = function () {};
				resolve();
			});
		};
		document.head.appendChild(script);
	});
}

function initGsi() {
	return new Promise<void>((resolve) => {
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.defer = true;
		script.onload = () => {
			script.onload = function () {};
			resolve();
		};
		document.head.appendChild(script);
	});
}

declare namespace google.accounts.oauth2 {
	type Callback = (response: { access_token: string; error_description?: string }) => void;

	function initTokenClient(config: {
		client_id: string;
		callback: Callback;
		scope: string;
		prompt?: string;
		hosted_domain?: string;
	}): TokenClient;

	function revoke(access_token: string): void;

	interface TokenClient {
		callback: Callback;
		requestAccessToken(): void;
	}
}

const tokenClient = google.accounts.oauth2.initTokenClient({
	client_id: CLIENT_ID,
	scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
	// dummy
	callback: () => {},
	prompt: '',
	hosted_domain: 'hcmut.edu.vn'
});

function auth() {
	return new Promise<void>((resolve, reject) => {
		tokenClient.callback = ({ error_description }) => {
			if (error_description) {
				reject(error_description);
			} else {
				resolve();
			}
		};
		tokenClient.requestAccessToken();
	});
}

async function createCalendar(summary: string) {
	const { result: calendar } = await gapi.client.calendar.calendars.insert({
		summary
	});
	return calendar;
}

async function addEventsToCalendar(events: EventInput[], calendarId: string) {
	for (const event of events) {
		await gapi.client.calendar.events.insert({
			calendarId,
			resource: event
		});
	}
}
