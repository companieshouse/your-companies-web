import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import * as constants from "../../../../../src/constants";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { setExtraData, getExtraData } from "../../../../../src/lib/utils/sessionUtils";
import * as associationsService from "../../../../../src/services/associationsService";

const router = supertest(app);
const companyNumber = "123456";
const companyName = "Test Company Ltd";
const url = `/your-companies/remove-authorisation-do-not-restore/${companyNumber}`;
const session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../../src/lib/Logger");
jest.mock("../../../../../src/lib/utils/sessionUtils", () => ({
    ...jest.requireActual("../../../../../src/lib/utils/sessionUtils"),
    setExtraData: jest.fn(),
    getExtraData: jest.fn()
}));

jest.mock("../../../../../src/services/companyProfileService");

jest.mock("../../../../../src/services/associationsService", () => ({
    ...jest.requireActual("../../../../../src/services/associationsService"),
    isOrWasCompanyAssociatedWithUser: jest.fn(),
    removeUserFromCompanyAssociations: jest.fn()
}));

describe("POST /your-companies/remove-authorisation-do-not-restore/:companyNumber", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        (setExtraData as jest.Mock).mockImplementation((session, key, value) => {
            session.data[key] = value;
        });
        (getExtraData as jest.Mock).mockImplementation((session, key) => session.data[key]);
        setExtraData(session, constants.COMPANY_NAME, companyName);
        setExtraData(session, constants.COMPANY_NUMBER, companyNumber);
    });

    test.each([
        // Given
        { condition: "user company association is not migrated", associationState: "COMPANY_NOT_ASSOCIATED_WITH_USER", removalResult: "user removed from company associations" },
        { condition: "user has migrated state, but removal result is unexpected", associationState: "COMPANY_MIGRATED_NOT_YET_ASSOCIATED_WITH_USER", removalResult: "UNEXPECTED_RESULT" }
    ])("should return status 200 and render error page if $condition'",
        async ({ associationState, removalResult }) => {
            (associationsService.isOrWasCompanyAssociatedWithUser as jest.Mock).mockResolvedValue({
                state: associationState
            });

            (associationsService.removeUserFromCompanyAssociations as jest.Mock).mockResolvedValue(
                removalResult
            );

            const request = router.post(url);
            // When
            const response = await request;
            // Then
            expect(response.status).toBe(200);
            expect(response.text).toContain("Sorry, there is a problem with the service");
        });
});
