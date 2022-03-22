import { browser } from "$app/env";
import { API_KEY } from "./cred";

// script loader helper
export const gapiPromise: Promise<void> = new Promise((resolve) => {
    if (!browser) return;
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
        gapi.load("client", async () => {
            await gapi.client.init({
                apiKey: API_KEY,
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
