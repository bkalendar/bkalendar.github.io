import { Readable, readable } from "svelte/store";

const API_KEY: string = "AIzaSyBB2fk24uJrAXx_Q7DVPD0XdzUZ6xaFbRI";
const CLIENT_ID: string =
  "1003739652458-kgklao4co5lrtffceqeq8ng2m7m1pde6.apps.googleusercontent.com";

// script loader helper
async function loadGapi() {
  await new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = async () => {
      gapi.load("client:auth2", async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope:
            "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly",
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


// Singleton class for managing global `gapi`
export class GapiManager {
  private static loadPromise: Promise<void> | null = null;

  private constructor() { }

  static async load() {
    if (!GapiManager.loadPromise) {
      GapiManager.loadPromise = loadGapi().then(() => {
        GapiManager._user = readable<User>(
          gapi.auth2.getAuthInstance().currentUser.get(),
          (set) => {
            gapi.auth2.getAuthInstance().currentUser.listen(set);
          }
        );
      });
    }
    return GapiManager.loadPromise;
  }

  static _user: Readable<User>;

  static async user() {
    await GapiManager.load();
    return GapiManager._user;
  }

  static async signIn() {
    await GapiManager.load();
    await gapi.auth2.getAuthInstance().signIn();
    return await GapiManager.user();
  }

  static async signOut() {
    await GapiManager.load();
    gapi.auth2.getAuthInstance().signOut();
  }

  static async getCalendarList() {
    await GapiManager.load();
    return new Promise<gapi.client.calendar.CalendarList>((resolve, reject) => {
      gapi.client.calendar.calendarList.list().execute((list, resp) => {
        resolve(list);
      });
    });
  }
}
