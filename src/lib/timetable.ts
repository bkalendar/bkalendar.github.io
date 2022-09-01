import type { MachineTimetable } from '@bkalendar/core';
import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

const KEY = Symbol();
const store = writable<MachineTimetable | null>(null);

export function createTimetableCtx() {
	setContext(KEY, store);
}

export function getTimetableCtx(): typeof store {
	return getContext(KEY);
}
