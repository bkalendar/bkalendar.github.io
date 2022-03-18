import { parse } from "cookie";

import type { GetSession, Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const cookie = parse(event.request.headers.get("cookie") || "");
    event.locals.accessToken = cookie["access_token"];

    const res = await resolve(event);
    return res;
};

export const getSession: GetSession = (event) => {
    return {
        accessToken: event.locals.accessToken,
    };
};
