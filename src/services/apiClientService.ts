import { Request } from "express";
import { createPrivateApiClient } from "private-api-sdk-node";
import { API_URL, INTERNAL_API_URL } from "../constants";
import PrivateApiClient from "private-api-sdk-node/dist/client";
import { getAccessToken } from "../lib/utils/sessionUtils";
import { createApiClient } from "@companieshouse/api-sdk-node";
import { Session } from "@companieshouse/node-session-handler";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";

/**
 * Creates an instance of the Private API client using OAuth authentication.
 *
 * @param req - The Express request object, used to retrieve the session and access token.
 * @returns An instance of the Private API client configured with the OAuth access token.
 */
export function createOauthPrivateApiClient (req: Request): PrivateApiClient {
    const oauthAccessToken = getAccessToken(req.session);
    return createPrivateApiClient(undefined, oauthAccessToken, INTERNAL_API_URL, undefined);
}

/**
 * Creates an instance of the API client using OAuth authentication.
 *
 * @param session - The session object, or undefined if no session exists.
 * @param baseUrl - The API base URL, if not provided, the one that is set in the environment is used by default.
 * @returns An instance of the API client configured with the OAuth access token.
 */
export const createOAuthApiClient = (session: Session | undefined, baseUrl: string = API_URL): ApiClient => {
    return createApiClient(undefined, getAccessToken(session), baseUrl);
};
