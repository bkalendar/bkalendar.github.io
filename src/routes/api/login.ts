import { CLIENT_ID } from "$lib/stores/gapi";

export const get: RequestHandler = (req) => {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

    const params: Record<string, string> = {
        client_id: CLIENT_ID,
        redirect_uri: req.url.origin + "/code",
        state: req.url.searchParams.toString(),
        response_type: "code",
        scope: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly",
    };
    for (const key in params) {
        url.searchParams.set(key, params[key]);
    }

    return Response.redirect(url, 308);
};
