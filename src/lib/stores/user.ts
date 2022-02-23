import { readable, type Readable } from "svelte/store";
import { gapiPromise } from "./gapi";

export type UserStore = Readable<User> & {
    signIn: () => Promise<User>;
    signOut: () => void;
};

export const userPromise: Promise<UserStore> = gapiPromise.then(() => {
    const store = readable<User>(undefined, (set) => {
        set(gapi.auth2.getAuthInstance().currentUser.get());
        gapi.auth2.getAuthInstance().currentUser.listen(set);
    });
    return {
        ...store,
        signIn: () => gapi.auth2.getAuthInstance().signIn(),
        signOut: () => gapi.auth2.getAuthInstance().signOut(),
    };
});
