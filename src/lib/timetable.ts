import type { Timetable } from '@bkalendar/core';
import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

const KEY = Symbol();
const store = writable<Required<Timetable> | null>(null);

export function createTimetableCtx() {
	setContext(KEY, store);
}

export function getTimetableCtx(): typeof store {
	return getContext(KEY);
}
