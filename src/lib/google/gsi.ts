import { browser } from "$app/env";
import type { Readable } from "svelte/store";
import { CLIENT_ID } from "./cred";

export const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.readonly";
export const EVENTS_SCOPE = "https://www.googleapis.com/auth/calendar.events";

declare namespace google.accounts.oauth2 {
    function initTokenClient(config: {
        client_id: string;
        callback: (response: {
            access_token: string;
            error_description?: string;
        }) => void;
        scope: string;
        prompt?: string;
        hosted_domain?: string;
    }): TokenClient;

    interface TokenClient {
        requestAccessToken(): void;
    }
}

interface User {
    name: string;
}

interface UserStore extends Readable<User | null> {}

export const gsiPromise: Promise<void> = new Promise((resolve) => {
    if (!browser) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
        script.onload = function () {};
        resolve();
    };
    document.head.appendChild(script);
});

export async function requestAccessToken(scope: string) {
    await gsiPromise;
    return new Promise<string>((resolve, reject) => {
        const client = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope,
            callback: ({ access_token, error_description }) => {
                if (error_description) return reject(error_description);
                resolve(access_token);
            },
            prompt: "",
            hosted_domain: "hcmut.edu.vn",
        });
        client.requestAccessToken();
    });
}
