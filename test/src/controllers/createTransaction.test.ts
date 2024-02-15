/* eslint-disable import/first */

jest.mock("../../../src/services/transactionService");
jest.mock("../../../src/lib/Logger");

import mocks from "../../mocks/all.middleware.mock";
import * as constants from "../../../src/constants";
import app from "../../../src/app";
import supertest from "supertest";
import * as urlUtils from "../../../src/lib/utils/urlUtils";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { postTransaction, createAccountsAssociation } from "../../../src/services/transactionService";

const router = supertest(app);
const companyNumber = "12345678";
const url = urlUtils.getUrlWithCompanyNumber(constants.CREATE_TRANSACTION_PATH_FULL, companyNumber);
const PAGE_HEADING = "Found. Redirecting to /your-companies/company/12345678/confirmation-company-added";
const TRANSACTION_ID = "1234";

const mockPostTransaction = postTransaction as jest.Mock;
const mockCreateAccountsAssociation = createAccountsAssociation as jest.Mock;

const dummyTransaction = {
    id: TRANSACTION_ID
} as Transaction;

describe("create transaction controller tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should check session, auth and company authorisation before posting transaction", async () => {
        mockPostTransaction.mockResolvedValueOnce(dummyTransaction);
        mockCreateAccountsAssociation.mockResolvedValueOnce({
            httpStatusCode: 201,
            resource: {
                id: "87654321"
            }
        });
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockPostTransaction).toHaveBeenCalled();

    });
    it("should redirect to success page after posting transaction", async () => {
        mockPostTransaction.mockResolvedValueOnce(dummyTransaction);
        mockCreateAccountsAssociation.mockResolvedValueOnce({
            httpStatusCode: 201,
            resource: {
                id: "87654321"
            }
        });
        const response = await router.get(url);
        expect(response.status).toBe(302);
        expect(response.text).toContain(PAGE_HEADING);
    });

    it("should return 500 when Accounts Association fails", async () => {
        mockPostTransaction.mockResolvedValueOnce(dummyTransaction);
        mockCreateAccountsAssociation.mockResolvedValueOnce({
            httpStatusCode: 400
        });
        const response = await router.get(url);
        expect(mockPostTransaction).toHaveBeenCalled();
        expect(mockCreateAccountsAssociation).toHaveBeenCalled();
        expect(mockCreateAccountsAssociation.mock.calls[0][1]).toEqual(TRANSACTION_ID);
        expect(response.text).toContain("Status code: 500");
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
