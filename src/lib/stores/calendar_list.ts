import { browser } from "$app/env";
import { derived, writable, type Readable, type Writable } from "svelte/store";
import { user } from "./user";

interface Calendar {
    id: string;
    summary: string;
    colorId?: string;
}

export const selectedCalendar: Writable<Calendar> = writable(
    undefined,
    (set) => {
        if (browser) {
            const raw = localStorage.getItem("bkalendar-calendar");
            set(raw && JSON.parse(raw));
        }
    }
);

selectedCalendar.subscribe((calendar) => {
    if (browser && calendar) {
        localStorage.setItem("bkalendar-calendar", JSON.stringify(calendar));
    }
});

export const calendarList: Readable<Promise<Calendar[]>> = derived(
    user,
    async ($user) => {
        if (!browser || !$user) return new Promise<Calendar[]>(() => {});
        if (!$user.isSignedIn()) return Promise.resolve([]);

        return new Promise<Calendar[]>((resolve) => {
            gapi.client.calendar.calendarList.list().execute((list) => {
                resolve(list.items);
            });
        });
    }
);

export let calendarListValue: Calendar[];
calendarList.subscribe(async (calendars) => {
    calendarListValue = await calendars;
    console.log(calendarListValue);
});
