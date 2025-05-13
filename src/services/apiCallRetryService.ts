import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { getAccessToken } from "../lib/utils/sessionUtils";
import { createOauthPrivateApiClient } from "./apiClientService";
import { refreshToken } from "./refreshTokenService";
import logger from "../lib/Logger";

/**
 * Calls API and if the response is unauthorized then it refreshes access token and retries the call to the API.
 *
 * @param serviceName - The name of the service being called
 * @param fnName - The name of the function being called
 * @param req - The request object
 * @param session - The session object
 * @param otherParams - Additional parameters for the API call
 * @returns - The response from the API call
 */
export const makeApiCallWithRetry = async (
    serviceName: string,
    fnName: string,
    req: Request,
    session: Session,
    ...otherParams: any[]
): Promise<unknown> => {

    logger.info(`${makeApiCallWithRetry.name}: Making a ${fnName} call on ${serviceName} service with token ${getAccessToken(session)}`);

    let client = createOauthPrivateApiClient(req);

    let response = await client[serviceName][fnName](...otherParams);

    if (response?.httpStatusCode === 401) {

        const responseMsg = `Retrying ${fnName} call on ${serviceName} service after unauthorised response`;
        logger.info(`${makeApiCallWithRetry.name}: ${responseMsg} - ${JSON.stringify(response)}`);

        const accessToken = await refreshToken(req, session);
        logger.info(`${makeApiCallWithRetry.name}: New access token: ${accessToken}`);

        client = createOauthPrivateApiClient(req);
        response = await client[serviceName][fnName](...otherParams);

    }

    logger.info(`${makeApiCallWithRetry.name}: Call successful.`);

    return response;

};
