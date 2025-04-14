import { Request } from "express";
import { createPrivateApiClient } from "private-api-sdk-node";
import { INTERNAL_API_URL } from "../constants";
import PrivateApiClient from "private-api-sdk-node/dist/client";
import { getAccessToken } from "../lib/utils/sessionUtils";

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
