import { browser } from "$app/env";
import { readable } from "svelte/store";
import { load } from "./gapi";

export const user = readable<User>(undefined, (set) => {
    if (!browser) return undefined;
    load().then(() => {
        set(gapi.auth2.getAuthInstance().currentUser.get());
        gapi.auth2.getAuthInstance().currentUser.listen(set);
    });
});

export async function signIn() {
    await load();
    return gapi.auth2.getAuthInstance().signIn();
}
