import { browser } from "$app/env";
import {
    derived,
    readable,
    writable,
    type Readable,
    type Writable,
} from "svelte/store";
import { userPromise } from "./user";

interface Calendar {
    id: string;
    summary: string;
    colorId?: string;
}

export const selectedCalendarPromise: Promise<Writable<Calendar | null>> = new Promise(
    (resolve) => {
        if (!browser) return;
        const KEY = "bkalendar-calendar";
        const raw = localStorage.getItem(KEY);
        const store = writable<Calendar | null>(raw && JSON.parse(raw));
        store.subscribe(($store) => {
            const raw = JSON.stringify($store);
            localStorage.setItem(KEY, raw);
        });
        resolve(store);
    }
);

export const calendarsPromise: Readable<Promise<Calendar[]>> = readable(
    new Promise(() => { }),
    (set) => {
        userPromise.then((user) => {
            user.subscribe(async ($user) => {
                if (!$user.isSignedIn()) return Promise.resolve([]);

                const promise = new Promise<Calendar[]>((resolve) => {
                    gapi.client.calendar.calendarList.list().execute((list) => {
                        resolve(list.items);
                    });
                });

                set(promise);
            });
        });
    }
);

export let calendarListValue: Calendar[];
calendarsPromise.subscribe(async (calendars) => {
    calendarListValue = await calendars;
    // console.log(calendarListValue);
});

interface CalendarEvent {
    id: string;
    colorId?: string;
    summary: string;
    description: string;
    start: {
        dateTime?: string;
        timeZone?: string;
    };
    end: {
        dateTime?: string;
        timeZone?: string;
    };
    recurrence: string[];
}

export const selectedCalendarEventsPromise: Readable<Promise<CalendarEvent[]>> =
    readable(new Promise(() => { }), (set) => {
        Promise.all([selectedCalendarPromise, userPromise]).then((stores) => {
            const store = derived(stores, async ([$selected, $user]) => {
                if (!$user.isSignedIn() || !$selected)
                    return Promise.resolve<CalendarEvent[]>([]);
                return new Promise<CalendarEvent[]>((resolve) => {
                    gapi.client.calendar.events
                        .list({ calendarId: $selected.id })
                        .execute((list) => {
                            resolve(
                                list.items.filter((item) =>
                                    item.id.includes("@bkalendar")
                                )
                            );
                        });
                });
            });
            store.subscribe(set);
        });
    });
