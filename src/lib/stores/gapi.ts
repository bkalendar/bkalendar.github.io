import type { Readable } from 'svelte/store';
import { readable } from "svelte/store";

const API_KEY: string = "AIzaSyBB2fk24uJrAXx_Q7DVPD0XdzUZ6xaFbRI";
const CLIENT_ID: string =
    "1003739652458-kgklao4co5lrtffceqeq8ng2m7m1pde6.apps.googleusercontent.com";

// script loader helper
async function loadGapi() {
    return new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.onload = async () => {
            gapi.load("client:auth2", async () => {
                await gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    scope: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly",
                    discoveryDocs: [
                        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
                    ],
                });
                script.onload = undefined;
                resolve();
            });
        };
        document.head.appendChild(script);
    });
}

// Singleton promise for managing global `gapi`
let loadPromise: Promise<void> | null = null;

async function load() {
    if (!loadPromise) {
        loadPromise = loadGapi().then(() => {
            _user = readable<User>(
                gapi.auth2.getAuthInstance().currentUser.get(),
                (set) => {
                    gapi.auth2.getAuthInstance().currentUser.listen(set);
                }
            );
        });
    }
    return loadPromise;
}

let _user: Readable<User>;

export async function user() {
    await load();
    return _user;
}

export async function signIn() {
    await load();
    await gapi.auth2.getAuthInstance().signIn();
    return await user();
}

export async function signOut() {
    await load();
    gapi.auth2.getAuthInstance().signOut();
}

export async function getCalendarList() {
    await load();
    return new Promise<gapi.client.calendar.CalendarList>((resolve, reject) => {
        gapi.client.calendar.calendarList.list().execute((list, resp) => {
            resolve(list);
        });
    });
}

interface Color {
    background: string;
    foreground: string;
}

interface ColorsList {
    [key: string]: Color,
}

export function getColorsList(): ColorsList {
    return {
        "1": {
            "background": "#a4bdfc",
            "foreground": "#1d1d1d"
        },
        "2": {
            "background": "#7ae7bf",
            "foreground": "#1d1d1d"
        },
        "3": {
            "background": "#dbadff",
            "foreground": "#1d1d1d"
        },
        "4": {
            "background": "#ff887c",
            "foreground": "#1d1d1d"
        },
        "5": {
            "background": "#fbd75b",
            "foreground": "#1d1d1d"
        },
        "6": {
            "background": "#ffb878",
            "foreground": "#1d1d1d"
        },
        "7": {
            "background": "#46d6db",
            "foreground": "#1d1d1d"
        },
        "8": {
            "background": "#e1e1e1",
            "foreground": "#1d1d1d"
        },
        "9": {
            "background": "#5484ed",
            "foreground": "#1d1d1d"
        },
        "10": {
            "background": "#51b749",
            "foreground": "#1d1d1d"
        },
        "11": {
            "background": "#dc2127",
            "foreground": "#1d1d1d"
        }
    }
}
