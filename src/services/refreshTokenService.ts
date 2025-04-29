import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { createOAuthApiClient } from "./apiClientService";
import { getAccessToken, getRefreshToken, setAccessToken } from "../lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, REFRESH_TOKEN_GRANT_TYPE } from "../constants";
import logger from "../lib/Logger";

/**
 * Refreshes the access token by calling refreshToken service.
 *
 * @param req - The request object.
 * @param session - The session object.
 * @returns The new access token.
 */
export const refreshToken = async (req: Request, session: Session): Promise<string> => {
    const apiClient: ApiClient = createOAuthApiClient(session);

    logger.info(`${refreshToken.name}: Making a POST request for refreshing access token ${getAccessToken(session)}`);

    const refreshTokenData = await apiClient.refreshToken.refresh(
        getRefreshToken(session),
        REFRESH_TOKEN_GRANT_TYPE,
        OAUTH2_CLIENT_ID,
        OAUTH2_CLIENT_SECRET
    ) as any;
    const accessToken = refreshTokenData?.resource?.access_token;

    if (!accessToken) {
        const errorMessage = `Error on refresh token ${JSON.stringify(refreshTokenData)}`;
        logger.error(`${refreshToken.name}: ${errorMessage}`);
        throw new Error(errorMessage);
    }

    setAccessToken(session, accessToken);

    return accessToken;
};
