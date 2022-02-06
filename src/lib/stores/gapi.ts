import { Readable, readable } from 'svelte/store';

const API_KEY: string = 'AIzaSyBB2fk24uJrAXx_Q7DVPD0XdzUZ6xaFbRI'
const CLIENT_ID: string = '1003739652458-kgklao4co5lrtffceqeq8ng2m7m1pde6.apps.googleusercontent.com'

// script loader helper
async function loadGapi() {
    await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = async () => {
            gapi.load('client:auth2', async () => {
                await gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    scope: 'https://www.googleapis.com/auth/calendar',
                    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
                });
                script.onload = undefined;
                resolve();
            }
            )
        };
        document.head.appendChild(script);
    })
}

// Singleton class for managing global `gapi`
export class GapiManager {
    private static manager: Readable<GapiManager>;
    private constructor() { }
    static async getInstance() {
        if (!this.manager) {
            await loadGapi();
            let manager = new GapiManager;
            manager.user = gapi.auth2.getAuthInstance().currentUser.get();
            this.manager = readable<GapiManager>(manager, set => {
                gapi.auth2.getAuthInstance().currentUser.listen((user) => {
                    manager.user = user;
                    set(manager)
                });
            });
        }
        return this.manager;
    }

    user: gapi.auth2.GoogleUser;

    // use this if you are confident
    static getInstanceUnchecked() {
        return this.manager;
    }

    signIn() {
        gapi.auth2.getAuthInstance().signIn();
    }

    signOut() {
        gapi.auth2.getAuthInstance().signOut();
    }

    async getCalendarList() {
        return new Promise<gapi.client.calendar.CalendarList>((resolve, reject) => {
            gapi.client.calendar.calendarList.list().execute((list, resp) => {
                resolve(list);
            })
        })
    }


}
