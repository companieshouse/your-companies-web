import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { refreshToken } from "./refreshTokenService";
import logger, { createLogMessage } from "../lib/Logger";
import { createOAuthApiClient } from "./apiClientService";
import * as constants from "../constants";

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

    logger.info(createLogMessage(req, makeApiCallWithRetry.name, `Making a ${fnName} call on ${serviceName} service with token access token`));

    let client = createOAuthApiClient(req.session, constants.ACCOUNTS_API_URL);

    let response = await client[serviceName][fnName](...otherParams);

    if (response?.httpStatusCode === 401) {

        const responseMsg = `Status 401: retrying ${fnName} call on ${serviceName} service after unauthorised response`;
        logger.info(createLogMessage(req, makeApiCallWithRetry.name, `${responseMsg} - ${JSON.stringify(response)}`));

        await refreshToken(req, session);
        logger.info(createLogMessage(req, makeApiCallWithRetry.name, `Token refreshed sucessfully`));

        client = createOAuthApiClient(req.session, constants.ACCOUNTS_API_URL);
        response = await client[serviceName][fnName](...otherParams);

    }

    logger.info(createLogMessage(req, makeApiCallWithRetry.name, `Response received, call to ${serviceName} ${fnName} successful.`));

    return response;

};
