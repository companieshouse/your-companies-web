/* eslint-disable import/first */
import mocks from "../../../mocks/all.middleware.mock";
import * as constants from "../../../../src/constants";
import app from "../../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import * as urlUtils from "../../../../src/lib/utils/urlUtils";
import * as associationsService from "../../../../src/services/associationsService";
import { Session } from "@companieshouse/node-session-handler";
import { CompanyNameAndNumber } from "../../../../src/types/util-types";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";

const router = supertest(app);
const session: Session = new Session();
const companyNumber = "12345678";
const url = urlUtils.getUrlWithCompanyNumber(constants.CREATE_COMPANY_ASSOCIATION_PATH_FULL, companyNumber);
const PAGE_HEADING = "Found. Redirecting to /your-companies/confirmation-company-added";

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

const mockCreateCompanyAssociation: jest.SpyInstance = jest.spyOn(associationsService, "createAssociation");

describe("create company association controller tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, auth and company authorisation before creating association", async () => {
        // Given
        mockCreateCompanyAssociation.mockResolvedValueOnce("0123456789");
        const confirmedCompanyForAssocation: CompanyNameAndNumber = { companyNumber, companyName: "Test Inc." };
        session.setExtraData(constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssocation);
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockCompanyAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockCreateCompanyAssociation).toHaveBeenCalled();
    });

    it("should redirect to success page after creating company assocation", async () => {
        // Given
        mockCreateCompanyAssociation.mockResolvedValueOnce("0123456789");
        const confirmedCompanyForAssocation: CompanyNameAndNumber = { companyNumber, companyName: "Test Inc." };
        session.setExtraData(constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssocation);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toBe(302);
        expect(response.text).toContain(PAGE_HEADING);
    });

    it("should error and render and error page if updateAssociationStatus request fails", async () => {
        // Given
        const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
        const badRequestError = createError(HTTP_STATUS_CODE, `Http status code ${HTTP_STATUS_CODE} - Failed to change status for an association`);
        mockCreateCompanyAssociation.mockRejectedValueOnce(badRequestError);
        const confirmedCompanyForAssocation: CompanyNameAndNumber = { companyNumber, companyName: "Test Inc." };
        session.setExtraData(constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssocation);
        // When
        const response = await router.get(url);
        // Then
        expect(response.text).toContain("Sorry, there is a problem with the service");
    });
});
