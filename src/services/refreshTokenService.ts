import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { createOAuthApiClient } from "./apiClientService";
import { getRefreshToken, setAccessToken } from "../lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import * as constants from "../constants";
import logger, { createLogMessage } from "../lib/Logger";

/**
 * Refreshes the access token by calling refreshToken service.
 *
 * @param req - The request object.
 * @param session - The session object.
 * @returns The new access token.
 */
export const refreshToken = async (req: Request, session: Session): Promise<string> => {
    const apiClient: ApiClient = createOAuthApiClient(session);

    logger.info(createLogMessage(req, refreshToken.name, `Making a POST request to refresh access token`));

    const refreshTokenData = await apiClient.refreshToken.refresh(
        getRefreshToken(session),
        constants.REFRESH_TOKEN_GRANT_TYPE,
        constants.OAUTH2_CLIENT_ID,
        constants.OAUTH2_CLIENT_SECRET
    ) as any;
    const accessToken = refreshTokenData?.resource?.access_token;

    if (!accessToken) {
        const errorMessage = `Error getting refresh token, no token received`;
        logger.error(createLogMessage(req, refreshToken.name, errorMessage));
        throw new Error(errorMessage);
    }

    setAccessToken(session, accessToken);
    logger.info(createLogMessage(req, refreshToken.name, "Successfully refreshed access token"));
    return accessToken;
};
