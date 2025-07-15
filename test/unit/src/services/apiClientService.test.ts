import { createOAuthApiClient } from "../../../../src/services/apiClientService";
import { createApiClient, IHttpClient } from "@companieshouse/api-sdk-node";
import { Session } from "@companieshouse/node-session-handler";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/lib/Logger");

describe("createOAuthApiClient", () => {
    it("should return private API client", () => {
        // Given
        const apiClient: ApiClient = new ApiClient({} as IHttpClient, {} as IHttpClient);
        (createApiClient as jest.Mock).mockReturnValue(apiClient);
        // When
        const result = createOAuthApiClient(new Session());
        // Then
        expect(result).toBeInstanceOf(ApiClient);
    });
});
