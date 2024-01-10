import Axios, { AxiosInstance } from "axios";
import { AccountUserCompanyServiceClient } from "../../../src/services/accountUserCompanyServiceClient";

jest.mock("axios");
const mockedAxios = Axios as jest.Mocked<typeof Axios>;
const baseURL = "https://localhost:8080/v1/accounts";

describe("Account User Company Service Client", () => {
    describe("getCompanyInfoForCompanyNumber", () => {
        it("should return company info successfully if the company number is correct", async () => {
            // Given
            const responseData = require("../../mocks/companyInfoResponseSuccessMock.json");
            const expectedCompanyInfo = require("../../mocks/companyInfoResponseSuccessCamelMock.json");
            const mockGet = jest.fn().mockResolvedValue({ data: responseData });
            mockedAxios.create.mockReturnValueOnce({ get: mockGet } as unknown as AxiosInstance);
            const accountUserCompanyServiceClient = new AccountUserCompanyServiceClient(baseURL);
            const companyNumber = "12345678";
            // When
            const result = await accountUserCompanyServiceClient.getCompanyInfoForCompanyNumber(companyNumber);
            // Then
            expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL: baseURL });
            expect(mockGet.mock.calls[0][0]).toContain(`/companies/${companyNumber}`);
            expect(result).toEqual(expectedCompanyInfo);
        });

        it("should return error if the company number is incorrect", async () => {
            // Given
            const responseData = require("../../mocks/companyInfoResponseErrorMock.json");
            const expectedErrors = require("../../mocks/companyInfoResponseErrorCamelMock.json");
            const mockGet = jest.fn().mockResolvedValue({ data: responseData });
            mockedAxios.create.mockReturnValueOnce({ get: mockGet } as unknown as AxiosInstance);
            const accountUserCompanyServiceClient = new AccountUserCompanyServiceClient(baseURL);
            const companyNumber = "11111111";
            // When
            const result = await accountUserCompanyServiceClient.getCompanyInfoForCompanyNumber(companyNumber);
            // Then
            expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL: baseURL });
            expect(mockGet.mock.calls[0][0]).toContain(`/companies/${companyNumber}`);
            expect(result).toEqual(expectedErrors);
        });
    });
});
