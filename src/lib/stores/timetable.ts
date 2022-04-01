import { browser } from "$app/env";
import type { TimetableResolved } from "$lib/timetable";
import { writable, type Writable } from "svelte/store";

const KEY = "bkalendar-timetable";

export const timetableStore: Writable<TimetableResolved | null> =
    writable(null);

export const timetableReady = new Promise<void>((resolve) => {
    if (!browser) return;
    const raw = localStorage.getItem(KEY);
    timetableStore.set(raw && JSON.parse(raw));
    resolve();
});

timetableStore.subscribe((timetable) => {
    if (!browser || !timetable) return;
    const raw = JSON.stringify(timetable);
    localStorage.setItem(KEY, raw);
});
