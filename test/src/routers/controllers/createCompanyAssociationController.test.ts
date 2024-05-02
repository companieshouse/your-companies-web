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
import { AssociationState, AssociationStateResponse } from "../../../../src/types/associations";
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
const mockUpdateAssociationStatus: jest.SpyInstance = jest.spyOn(associationsService, "updateAssociationStatus");

describe("create company association controller tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, auth and company authorisation before creating association", async () => {
        // Given
        mockCreateCompanyAssociation.mockResolvedValueOnce("0123456789");
        const confirmedCompanyForAssocation: CompanyNameAndNumber = { companyNumber: "01234567", companyName: "Test Inc." };
        session.setExtraData(constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssocation);
        const associationStateResponse: AssociationStateResponse = { state: AssociationState.COMPNANY_NOT_ASSOCIATED_WITH_USER };
        session.setExtraData(constants.ASSOCIATION_STATE_RESPONSE, associationStateResponse);
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockCreateCompanyAssociation).toHaveBeenCalled();
    });

    it("should redirect to success page after creating company assocation", async () => {
        // Given
        mockCreateCompanyAssociation.mockResolvedValueOnce("0123456789");
        const confirmedCompanyForAssocation: CompanyNameAndNumber = { companyNumber: "01234567", companyName: "Test Inc." };
        session.setExtraData(constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssocation);
        const associationStateResponse: AssociationStateResponse = { state: AssociationState.COMPNANY_NOT_ASSOCIATED_WITH_USER };
        session.setExtraData(constants.ASSOCIATION_STATE_RESPONSE, associationStateResponse);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toBe(302);
        expect(response.text).toContain(PAGE_HEADING);
        expect(session.getExtraData(constants.ASSOCIATION_STATE_RESPONSE)).toBeUndefined();
    });

    it("should redirect to success page after updating company assocation status to confirmed", async () => {
        // Given
        mockUpdateAssociationStatus.mockResolvedValueOnce("0123456789");
        const confirmedCompanyForAssocation: CompanyNameAndNumber = { companyNumber: "01234567", companyName: "Test Inc." };
        session.setExtraData(constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssocation);
        const associationStateResponse: AssociationStateResponse = { state: AssociationState.COMPNANY_WAS_ASSOCIATED_WITH_USER, associationId: "0123456789" };
        session.setExtraData(constants.ASSOCIATION_STATE_RESPONSE, associationStateResponse);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toBe(302);
        expect(response.text).toContain(PAGE_HEADING);
        expect(session.getExtraData(constants.ASSOCIATION_STATE_RESPONSE)).toBeUndefined();
    });
    it("should not redirect to success page if updateAssociationStatus request fails", async () => {
        // Given
        const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
        const badRequestError = createError(HTTP_STATUS_CODE, `Http status code ${HTTP_STATUS_CODE} - Failed to change status for an association`);
        mockUpdateAssociationStatus.mockRejectedValueOnce(badRequestError);
        const confirmedCompanyForAssocation: CompanyNameAndNumber = { companyNumber: "01234567", companyName: "Test Inc." };
        session.setExtraData(constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssocation);
        const associationStateResponse: AssociationStateResponse = { state: AssociationState.COMPNANY_WAS_ASSOCIATED_WITH_USER, associationId: "0123456789" };
        session.setExtraData(constants.ASSOCIATION_STATE_RESPONSE, associationStateResponse);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toBe(400);
    });
});
