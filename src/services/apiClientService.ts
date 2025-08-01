import { ACCOUNT_LOCAL_URL, CHS_API_KEY } from "../constants";
import { getAccessToken } from "../lib/utils/sessionUtils";
import { createApiClient } from "@companieshouse/api-sdk-node";
import { Session } from "@companieshouse/node-session-handler";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";

/**
 * Creates an instance of the API client using OAuth authentication.
 *
 * @param session - The session object, or undefined if no session exists.
 * @param baseAccountUrl - The account base URL, if not provided, the one that is set in the environment is used by default.
 * @returns An instance of the API client configured with the OAuth access token.
 */
export const createOAuthApiClient = (session: Session | undefined, baseAccountUrl: string = ACCOUNT_LOCAL_URL): ApiClient => {
    return createApiClient(undefined, getAccessToken(session), undefined, baseAccountUrl);
};

/**
 * Creates an instance of the API client using API key.
 *
 * @param apiKey - The API key, if not provided, the one that is set in the environment is used by default.
 * @param baseAccountUrl - The account base URL, if not provided, the one that is set in the environment is used by default.
 * @returns An instance of the API client configured with the API key.
 */
export const createKeyApiClient = (apiKey: string = CHS_API_KEY, baseAccountUrl?: string): ApiClient => {
    return createApiClient(apiKey, undefined, undefined, baseAccountUrl);
};
