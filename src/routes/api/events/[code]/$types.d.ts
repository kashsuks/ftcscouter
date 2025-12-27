import type { RequestEvent } from "@sveltejs/kit";

export interface RouteParams {
    code: string;
}

export type RequestHandler = (event: RequestEvent<RouteParams>) => Response | Promise<Response>;