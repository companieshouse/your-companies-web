import { Request } from "express";
import { refreshToken } from "../../../../src/services/refreshTokenService";
import { mockRequest } from "../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import { createOAuthApiClient } from "../../../../src/services/apiClientService";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

jest.mock("@companieshouse/api-sdk-node/dist/client");
jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/lib/utils/sessionUtils");
const mockRefresh = jest.fn();
const mockCreateOAuthApiClient = createOAuthApiClient as jest.Mock;
mockCreateOAuthApiClient.mockReturnValue({
    refreshToken: {
        refresh: mockRefresh
    }
});
const setAccessTokenSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setAccessToken");

describe("refreshToken", () => {
    it("should set access token in session and return the token", async () => {
        // Given
        const req: Request = mockRequest();
        const session: Session = new Session();
        const accessToken = "kdssfladsfjlasdfjsal";
        const refreshTokenData = {
            resource: {
                access_token: accessToken
            }
        };
        mockRefresh.mockReturnValue(refreshTokenData);
        // When
        const response = await refreshToken(req, session);
        // Then
        expect(response).toEqual(accessToken);
        expect(setAccessTokenSpy).toHaveBeenCalledTimes(1);
        expect(setAccessTokenSpy).toHaveBeenCalledWith(session, accessToken);
    });

    test.each([
        {
            condition: "no access token",
            refreshTokenData: {
                resource: {
                    access_token: undefined
                }
            }
        },
        {
            condition: "no resource",
            refreshTokenData: {
                resource: undefined
            }
        },
        {
            condition: "no refresh token data",
            refreshTokenData: undefined
        }
    ])("should throw an error if $condition returned from api call",
        async ({ refreshTokenData }) => {
            // Given
            const req: Request = mockRequest();
            const session: Session = new Session();
            mockRefresh.mockReturnValue(refreshTokenData);
            // Then
            await expect(refreshToken(req, session)).rejects.toThrow();
        });
});
