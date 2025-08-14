/* eslint-disable import/first */
import mocks from "../../../../../mocks/all.middleware.mock";
import * as constants from "../../../../../../src/constants";
import app from "../../../../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import * as associationsService from "../../../../../../src/services/associationsService";
import { Session } from "@companieshouse/node-session-handler";
import { CompanyNameAndNumber } from "../../../../../../src/types/utilTypes";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";

const router = supertest(app);
const session: Session = new Session();
const companyNumber = "12345678";
const url = "/your-companies/company/12345678/create-company-association";
const PAGE_HEADING = "Found. Redirecting to /your-companies/confirmation-company-added";

jest.mock("../../../../../../src/lib/Logger");
mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

const mockCreateCompanyAssociation: jest.SpyInstance = jest.spyOn(associationsService, "createAssociation");

describe("GET /your-companies/company/:companyNumber/create-company-association", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, auth and company authorisation before creating association", async () => {
        // Given
        mockCreateCompanyAssociation.mockResolvedValueOnce("0123456789");
        const confirmedCompanyForAssociation: CompanyNameAndNumber = { companyNumber, companyName: "Test Inc." };
        session.setExtraData(constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssociation);
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockCompanyAuthenticationMiddlewareCheckboxEnabled).toHaveBeenCalled();
        expect(mockCreateCompanyAssociation).toHaveBeenCalled();
    });

    it("should redirect to success page after creating company assocation", async () => {
        // Given
        mockCreateCompanyAssociation.mockResolvedValueOnce("0123456789");
        const confirmedCompanyForAssociation: CompanyNameAndNumber = { companyNumber, companyName: "Test Inc." };
        session.setExtraData(constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssociation);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toBe(302);
        expect(response.text).toContain(PAGE_HEADING);
    });

    it("should not redirect to success page if updateAssociationStatus request fails", async () => {
        // Given
        const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
        const badRequestError = createError(HTTP_STATUS_CODE, `Http status code ${HTTP_STATUS_CODE} - Failed to change status for an association`);
        mockCreateCompanyAssociation.mockRejectedValueOnce(badRequestError);
        const confirmedCompanyForAssociation: CompanyNameAndNumber = { companyNumber, companyName: "Test Inc." };
        session.setExtraData(constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssociation);
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toBe(400);
    });

    // Additional tests not particularly related to this route but to test if app.ts catches uncaught exceptions and unhandled rejections
    it("catches uncaught exceptions", async () => {
        // Given
        mocks.mockCompanyAuthenticationMiddlewareCheckboxEnabled.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            process.emit("uncaughtException", new Error("test error"));
            next();
        });
        const processExitMock = jest.spyOn(process, "exit").mockImplementation((number) => { throw new Error("process.exit: " + number); });
        // When
        await router.get(url);
        // Then
        expect(processExitMock).toHaveBeenCalledWith(1);
    });

    it("catches unhandled rejections", async () => {
        // Given
        mocks.mockCompanyAuthenticationMiddlewareCheckboxEnabled.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            const promise = new Promise<string>((resolve, reject) => {
                return reject;
            });
            process.emit("unhandledRejection", "reason", promise);
            next();
        });
        const processExitMock = jest.spyOn(process, "exit").mockImplementation((number) => { throw new Error("process.exit: " + number); });
        // When
        await router.get(url);
        // Then
        expect(processExitMock).toHaveBeenCalledWith(1);
    });
});
