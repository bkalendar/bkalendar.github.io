import type { Readable } from "svelte/store";
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
                script.onload = function () {};
                resolve();
            });
        };
        document.head.appendChild(script);
    });
}

// Singleton promise for managing global `gapi`
let loadPromise: Promise<void> | null = null;

export async function load() {
    if (!loadPromise) {
        loadPromise = loadGapi();
    }
    return loadPromise;
}

let _user: Readable<User>;

export async function getUser() {
    await load();
    return _user;
}

export async function signIn() {
    await load();
    await gapi.auth2.getAuthInstance().signIn();
    return await getUser();
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
