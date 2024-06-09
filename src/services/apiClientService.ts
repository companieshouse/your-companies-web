import { Request } from "express";
import { createPrivateApiClient } from "private-api-sdk-node";
// import { INTERNAL_API_URL } from "../constants";
import PrivateApiClient from "private-api-sdk-node/dist/client";
// import { getAccessToken } from "../lib/utils/sessionUtils";

export function createOauthPrivateApiClient (req: Request): PrivateApiClient {
    // const oauthAccessToken = getAccessToken(req.session);
    return createPrivateApiClient(undefined, "wEusf3QyFlp2ckUTPxIJLloWaLGRFq7H5PO1iynU465s9NmU0lngu5sCWbWjZxeBmv0WmVs6oQg-ixVyqz1Vyl", "https://internalapi.phoenix1.aws.chdev.org", undefined);
}
