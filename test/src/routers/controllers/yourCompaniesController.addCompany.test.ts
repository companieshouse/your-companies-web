// the order of the mock imports matter
import mocks from "../../../mocks/all.middleware.mock";
import { validActiveCompanyProfile, validDisolvedCompanyProfile } from "../../../mocks/companyProfile.mock";
import { Resource } from "@companieshouse/api-sdk-node";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import app from "../../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as commpanyProfileService from "../../../../src/services/companyProfileService";
import * as associationService from "../../../../src/services/associationsService";
import { PROPOSED_COMPANY_NUM } from "../../../../src/constants";
import * as referrerUtils from "../../../../src/lib/utils/referrerUtils";
import * as en from "../../../../src/locales/en/translation/add-company.json";
import * as cy from "../../../../src/locales/cy/translation/add-company.json";
import * as enCommon from "../../../../src/locales/en/translation/common.json";
import * as cyCommon from "../../../../src/locales/cy/translation/common.json";
import { Session } from "@companieshouse/node-session-handler";
import { AssociationState, AssociationStateResponse } from "../../../../src/types/associations";
import { getExtraData, setExtraData } from "../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../src/constants";

const router = supertest(app);
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn((session, key, value) => session.setExtraData(key, value)),
        getExtraData: jest.fn((session, key) => session.getExtraData(key))
    };
});

it("should check session and auth before returning the add company page", async () => {
    await router.get("/your-companies/add-company");
    expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
    expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
});

describe("GET /your-companies/add-company", () => {

    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    redirectPageSpy.mockReturnValue(false);

    it("should return status 200", async () => {
        await router.get("/your-companies/add-company").expect(200);
    });

    it("should return expected English content if language version set to English", async () => {
        const response = await router.get("/your-companies/add-company?lang=en");
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(en.what_is_the_company_number);
        expect(response.text).toContain(en.a_company_number_is_8_characters_long);
        expect(response.text).toContain(en.you_can_find_this_by_searching);
        expect(response.text).toContain(en.how_do_i_find_the_company_number);
        expect(response.text).toContain(enCommon.continue);
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        const response = await router.get("/your-companies/add-company?lang=cy");
        expect(response.text).toContain(cyCommon.back_link);
        expect(response.text).toContain(cy.what_is_the_company_number);
        expect(response.text).toContain(cy.a_company_number_is_8_characters_long);
        expect(response.text).toContain(cy.you_can_find_this_by_searching);
        expect(response.text).toContain(cy.how_do_i_find_the_company_number);
        expect(response.text).toContain(cyCommon.continue);
    });

    it("should validate and display invalid input and error if input stored in session", async () => {
        const expectedInput = "bad num";
        session.setExtraData(PROPOSED_COMPANY_NUM, expectedInput);
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.BAD_REQUEST
        } as Resource<CompanyProfile>);
        const response = await router.get("/your-companies/add-company");
        expect(response.text).toContain(expectedInput);
        expect(response.text).toContain("Enter a company number that is 8 characters long");
    });
    it("should not display input when cf=true is passed in url", async () => {
        const expectedInput = "bad num";
        session.setExtraData(PROPOSED_COMPANY_NUM, expectedInput);
        const response = await router.get("/your-companies/add-company?cf=true");
        expect(response.text).not.toContain(expectedInput);
        expect(response.text).not.toContain("Enter a company number that is 8 characters long");
    });
    it("should delete the page indicator in extraData on page load", async () => {
        // Given
        const CONFIRM_COMPANY_DETAILS_INDICATOR = "confirmCompanyDetailsIndicator";
        const value = true;
        setExtraData(session, CONFIRM_COMPANY_DETAILS_INDICATOR, value);
        const data = getExtraData(session, CONFIRM_COMPANY_DETAILS_INDICATOR);

        // When
        await router.get("/your-companies/add-company");
        const resultData = getExtraData(session, CONFIRM_COMPANY_DETAILS_INDICATOR);

        // Then
        expect(data).toBeTruthy();
        expect(resultData).toBeUndefined();
    });

});

describe("POST /your-companies/add-company", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return status 302 if company number is correct and the company is active and not already associated with the user", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validActiveCompanyProfile);
        const associationSpy: jest.SpyInstance = jest.spyOn(associationService, "isOrWasCompanyAssociatedWithUser");
        associationSpy.mockReturnValue(AssociationState.COMPNANY_NOT_ASSOCIATED_WITH_USER);
        // When
        const response = await router.post("/your-companies/add-company?lang=en").send({ companyNumber: "12345678" });
        // Then
        expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
    });

    it("should return status 302 if company number is correct and the company is active and not already associated with the user but was associated in the past", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validActiveCompanyProfile);
        const associationSpy: jest.SpyInstance = jest.spyOn(associationService, "isOrWasCompanyAssociatedWithUser");
        associationSpy.mockReturnValue(AssociationState.COMPNANY_WAS_ASSOCIATED_WITH_USER);
        // When
        const response = await router.post("/your-companies/add-company?lang=en").send({ companyNumber: "12345678" });
        // Then
        expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
    });

    it("should return expected English error message if company number is correct but company status is not active and language version set to English", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validDisolvedCompanyProfile);
        // When
        const response = await router.post("/your-companies/add-company?lang=en").send({ companyNumber: "23456789" });
        // Then
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(enCommon.there_is_a_problem);
        expect(response.text).toContain(en.what_is_the_company_number);
        expect(response.text).toContain(en.a_company_number_is_8_characters_long);
        expect(response.text).toContain(en.you_can_find_this_by_searching);
        expect(response.text).toContain(en.how_do_i_find_the_company_number);
        expect(response.text).toContain(enCommon.continue);
        expect(response.text).toContain(en.enter_a_company_number_for_a_company_that_is_active);
    });

    it("should return expected Welsh error message if company number is correct but company status is not active and language version set to Welsh", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validDisolvedCompanyProfile);
        // When
        const response = await router.post("/your-companies/add-company?lang=cy").send({ companyNumber: "23456789" });
        // Then
        expect(response.text).toContain(cyCommon.back_link);
        expect(response.text).toContain(cyCommon.there_is_a_problem);
        expect(response.text).toContain(cy.what_is_the_company_number);
        expect(response.text).toContain(cy.a_company_number_is_8_characters_long);
        expect(response.text).toContain(cy.you_can_find_this_by_searching);
        expect(response.text).toContain(cy.how_do_i_find_the_company_number);
        expect(response.text).toContain(cyCommon.continue);
        expect(response.text).toContain(cy.enter_a_company_number_for_a_company_that_is_active);
    });

    it("should return expected English error message if company number is correct but company has already been added to user account and language version set to English", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validActiveCompanyProfile);
        const associationSpy: jest.SpyInstance = jest.spyOn(associationService, "isOrWasCompanyAssociatedWithUser");
        const associationStateResponse: AssociationStateResponse = { state: AssociationState.COMPNANY_ASSOCIATED_WITH_USER, associationId: "12345678" };
        associationSpy.mockReturnValue(associationStateResponse);
        // When
        const response = await router.post("/your-companies/add-company?lang=en").send({ companyNumber: "12345678" });
        // Then
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(enCommon.there_is_a_problem);
        expect(response.text).toContain(en.what_is_the_company_number);
        expect(response.text).toContain(en.a_company_number_is_8_characters_long);
        expect(response.text).toContain(en.you_can_find_this_by_searching);
        expect(response.text).toContain(en.how_do_i_find_the_company_number);
        expect(response.text).toContain(enCommon.continue);
        expect(response.text).toContain(en.this_company_has_already_been_added_to_your_account);
    });

    it("should return expected Welsh error message if company number is correct but company has already been added to user account and language version set to Welsh", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validActiveCompanyProfile);
        const associationSpy: jest.SpyInstance = jest.spyOn(associationService, "isOrWasCompanyAssociatedWithUser");
        const associationStateResponse: AssociationStateResponse = { state: AssociationState.COMPNANY_ASSOCIATED_WITH_USER, associationId: "12345678" };
        associationSpy.mockReturnValue(associationStateResponse);
        // When
        const response = await router.post("/your-companies/add-company?lang=cy").send({ companyNumber: "12345678" });
        // Then
        expect(response.text).toContain(cyCommon.back_link);
        expect(response.text).toContain(cyCommon.there_is_a_problem);
        expect(response.text).toContain(cy.what_is_the_company_number);
        expect(response.text).toContain(cy.a_company_number_is_8_characters_long);
        expect(response.text).toContain(cy.you_can_find_this_by_searching);
        expect(response.text).toContain(cy.how_do_i_find_the_company_number);
        expect(response.text).toContain(cyCommon.continue);
        expect(response.text).toContain(cy.this_company_has_already_been_added_to_your_account);
    });

    it("should return expected English error message if company number is incorrect and language version set to English", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.BAD_REQUEST
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company?lang=en").send({ companyNumber: "%£$£$£5343" });
        // Then
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(enCommon.there_is_a_problem);
        expect(response.text).toContain(en.what_is_the_company_number);
        expect(response.text).toContain(en.a_company_number_is_8_characters_long);
        expect(response.text).toContain(en.you_can_find_this_by_searching);
        expect(response.text).toContain(en.how_do_i_find_the_company_number);
        expect(response.text).toContain(enCommon.continue);
        expect(response.text).toContain(en.enter_a_company_number_that_is_8_characters_long);
    });

    it("should return expected Welsh error message if company number is incorrect and language version set to Welsh", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.BAD_REQUEST
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company?lang=cy").send({ companyNumber: "%£$£$£5343" });
        // Then
        expect(response.text).toContain(cyCommon.back_link);
        expect(response.text).toContain(cyCommon.there_is_a_problem);
        expect(response.text).toContain(cy.what_is_the_company_number);
        expect(response.text).toContain(cy.a_company_number_is_8_characters_long);
        expect(response.text).toContain(cy.you_can_find_this_by_searching);
        expect(response.text).toContain(cy.how_do_i_find_the_company_number);
        expect(response.text).toContain(cyCommon.continue);
        expect(response.text).toContain(cy.enter_a_company_number_that_is_8_characters_long);
    });

    it("should return expected English error message if there is no company with provided number and language version set to English", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.NOT_FOUND
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company?lang=en").send({ companyNumber: "11111111" });
        // Then
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(enCommon.there_is_a_problem);
        expect(response.text).toContain(en.what_is_the_company_number);
        expect(response.text).toContain(en.a_company_number_is_8_characters_long);
        expect(response.text).toContain(en.you_can_find_this_by_searching);
        expect(response.text).toContain(en.how_do_i_find_the_company_number);
        expect(response.text).toContain(enCommon.continue);
        expect(response.text).toContain(en.enter_a_company_number_that_is_8_characters_long);
    });

    it("should return expected Welsh error message if there is no company with provided number and language version set to Welsh", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.NOT_FOUND
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company?lang=cy").send({ companyNumber: "11111111" });
        // Then
        expect(response.text).toContain(cyCommon.back_link);
        expect(response.text).toContain(cyCommon.there_is_a_problem);
        expect(response.text).toContain(cy.what_is_the_company_number);
        expect(response.text).toContain(cy.a_company_number_is_8_characters_long);
        expect(response.text).toContain(cy.you_can_find_this_by_searching);
        expect(response.text).toContain(cy.how_do_i_find_the_company_number);
        expect(response.text).toContain(cyCommon.continue);
        expect(response.text).toContain(cy.enter_a_company_number_that_is_8_characters_long);
    });

    it("should return expected English error message if there is no company number provided and language version set to English", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.NOT_FOUND
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company?lang=en").send({ companyNumber: "" });
        // Then
        expect(response.text).toContain(enCommon.back_link);
        expect(response.text).toContain(enCommon.there_is_a_problem);
        expect(response.text).toContain(en.what_is_the_company_number);
        expect(response.text).toContain(en.a_company_number_is_8_characters_long);
        expect(response.text).toContain(en.you_can_find_this_by_searching);
        expect(response.text).toContain(en.how_do_i_find_the_company_number);
        expect(response.text).toContain(enCommon.continue);
        expect(response.text).toContain(en.enter_a_company_number);
    });

    it("should return expected Welsh error message if there is no company number provided and language version set to Welsh", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.NOT_FOUND
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company?lang=cy").send({ companyNumber: "" });
        // Then
        expect(response.text).toContain(cyCommon.back_link);
        expect(response.text).toContain(cyCommon.there_is_a_problem);
        expect(response.text).toContain(cy.what_is_the_company_number);
        expect(response.text).toContain(cy.a_company_number_is_8_characters_long);
        expect(response.text).toContain(cy.you_can_find_this_by_searching);
        expect(response.text).toContain(cy.how_do_i_find_the_company_number);
        expect(response.text).toContain(cyCommon.continue);
        expect(response.text).toContain(cy.enter_a_company_number);
    });

    it("should return expected generic error message if any other error happens", async () => {
        // Given
        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.BAD_GATEWAY
        } as Resource<CompanyProfile>);
        // When
        const response = await router.post("/your-companies/add-company").send({ companyNumber: "12345678" });
        // Then
        expect(response.text).toContain(enCommon.generic_error_message);
    });

    it("should return company already added error message if user has come from the current page (switched languages)", async () => {
        // Given
        const url = "/your-companies/add-company";
        mocks.mockSessionMiddleware.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
            req.headers = { referrer: url };
            req.session = session;
            next();
        });

        const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");
        companyProfileSpy.mockReturnValue(validActiveCompanyProfile);

        const associationSpy: jest.SpyInstance = jest.spyOn(associationService, "isOrWasCompanyAssociatedWithUser");
        const associationStateResponse: AssociationStateResponse = { state: AssociationState.COMPNANY_ASSOCIATED_WITH_USER, associationId: "12345678" };
        associationSpy.mockReturnValue(associationStateResponse);

        const companyNumber = "12345678";
        setExtraData(session, constants.CURRENT_COMPANY_NUM, companyNumber);

        // When
        const response = await router.get(url).send({ companyNumber: "12345678" });

        // Then
        expect(response.text).toContain("This company has already been added to your account");
    });
});
