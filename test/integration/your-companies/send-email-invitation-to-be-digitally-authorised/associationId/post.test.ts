import mocks from "../../../../mocks/all.middleware.mock";
import { Session } from "@companieshouse/node-session-handler";
import app from "../../../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import * as referrerUtils from "../../../../../src/lib/utils/referrerUtils";
import * as constants from "../../../../../src/constants";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import { migratedAssociation } from "../../../../mocks/associations.mock";
import { when } from "jest-when";

const router = supertest(app);
const url = "/your-companies/send-email-invitation-to-be-digitally-authorised/1234567890";

const session: Session = new Session();

jest.mock("../../../../../src/lib/Logger");
jest.mock("../../../../../src/services/associationsService");
mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

describe("POST /your-companies/send-email-invitation-to-be-digitally-authorised/1234567890", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        redirectPageSpy.mockReturnValue(false);
    });

    it("should check session and auth before proceeding with the restoration of the digital authorisation",
        async () => {
            // Given
            getExtraDataSpy
                .mockReturnValueOnce("12345678")
                .mockReturnValueOnce("Test Ltd.")
                .mockReturnValueOnce(migratedAssociation.items[0]);
            // When
            await router.post(url);
            // Then
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        });

    it("redirects to create company association controller with company number param in url", async () => {
        // Given
        const companyNumber = migratedAssociation.items[0].companyNumber;
        const companyName = migratedAssociation.items[0].companyName;
        const associationId = migratedAssociation.items[0].id;
        when(getExtraDataSpy).calledWith(expect.any(Session), constants.COMPANY_NUMBER).mockReturnValue(companyNumber);
        when(getExtraDataSpy).calledWith(expect.any(Session), constants.COMPANY_NAME).mockReturnValue(companyName);
        when(getExtraDataSpy).calledWith(expect.any(Session), `${constants.ASSOCIATIONS_ID}_${associationId}`).mockReturnValue(migratedAssociation.items[0]);
        // When
        const response = await router.post(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual(`/your-companies/manage-authorised-people/${companyNumber}/confirmation-digital-authorisation-restored`);
    });
});
