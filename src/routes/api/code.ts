import { CLIENT_ID } from "$lib/stores/gapi";
import * as cookie from "cookie";

export const get: RequestHandler = async (req) => {
    const code = req.url.searchParams.get("code");
    if (!code)
        return {
            status: 400,
            body: req.url.searchParams.get("error"),
        };

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: import.meta.env["VITE_CLIENT_SECRET"] as string,
            code,
            grant_type: "authorization_code",
            redirect_uri: req.url.origin + req.url.pathname,
        }),
    });
    if (!res.ok) {
        return res;
    }
    const body = await res.json();

    const state = new URLSearchParams(
        decodeURIComponent(req.url.searchParams.get("state") || "")
    );
    const redirect = state.get("redirect");

    const headers: Record<string, string> = {
        "Set-Cookie": cookie.serialize("access_token", body.access_token, {
            maxAge: body.expires_in,
        }),
    };

    if (!redirect) {
        return new Response(null, { headers });
    }
    const response = Response.redirect(redirect, 302);
    for (const key in headers) {
        response.headers.set(key, headers[key]);
    }
    return response;
};
