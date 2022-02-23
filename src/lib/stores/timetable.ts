import { browser } from "$app/env";
import type { TimetableResolved } from "$lib/timetable";
import { writable, type Writable } from "svelte/store";

export type TimetableStore = Writable<TimetableResolved | null>;

export const timetablePromise: Promise<TimetableStore> = new Promise(
    (resolve) => {
        if (!browser) return;
        const KEY = "bkalendar-timetable";
        const raw = localStorage.getItem(KEY);
        const store = writable<TimetableResolved | null>(
            raw && JSON.parse(raw)
        );
        store.subscribe(($store) => {
            const raw = JSON.stringify($store);
            localStorage.setItem(KEY, raw);
        });
        resolve(store);
    }
);