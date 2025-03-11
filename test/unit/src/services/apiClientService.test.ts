import { Request } from "express";
import { createPrivateApiClient } from "private-api-sdk-node";
import PrivateApiClient from "private-api-sdk-node/dist/client";
import { createOauthPrivateApiClient } from "../../../../src/services/apiClientService";
import { IHttpClient } from "@companieshouse/api-sdk-node";
import { Session } from "@companieshouse/node-session-handler";
jest.mock("private-api-sdk-node");
jest.mock("../../../../src/lib/Logger");

describe("createOauthPrivateApiClient", () => {
    it("should return private API client", () => {
        // Given
        const req = {
            session: {
                data: {
                    signin_info: {
                        access_token: {
                            access_token: "Access Token"
                        }
                    }
                }
            } as Session
        } as Request;
        const privateApiClient: PrivateApiClient = new PrivateApiClient({} as IHttpClient, {} as IHttpClient);
        (createPrivateApiClient as jest.Mock).mockReturnValue(privateApiClient);
        // When
        const result = createOauthPrivateApiClient(req);
        // Then
        expect(result).not.toBeUndefined();
        expect(result).toBeInstanceOf(PrivateApiClient);
    });
});
