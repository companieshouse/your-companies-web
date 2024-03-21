import { Request } from "express";
import { createPrivateApiClient } from "@companieshouse/private-api-sdk-node";
import { INTERNAL_API_URL } from "../constants";
import PrivateApiClient from "@companieshouse/private-api-sdk-node/dist/client";

export function createOauthPrivateApiClient (req: Request): PrivateApiClient {
    const oauthAccessToken = req.session?.data.signin_info?.access_token?.access_token;
    return createPrivateApiClient(undefined, oauthAccessToken, INTERNAL_API_URL, undefined);
}
