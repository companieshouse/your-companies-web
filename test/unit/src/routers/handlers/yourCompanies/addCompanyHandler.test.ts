import { Request, Response } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as genericValidation from "../../../../../../src/lib/validation/generic";
import * as companyProfileService from "../../../../../../src/services/companyProfileService";
import * as associationsService from "../../../../../../src/services/associationsService";
import * as constants from "../../../../../../src/constants";
import { mockRequest } from "../../../../../mocks/request.mock";
import { mockResponse } from "../../../../../mocks/response.mock";
import { validActiveCompanyProfile, validDisolvedCompanyProfile } from "../../../../../mocks/companyProfile.mock";
import { AssociationState } from "../../../../../../src/types/associations";
import { AddCompanyHandler } from "../../../../../../src/routers/handlers/yourCompanies/addCompanyHandler";

jest.mock("../../../../../../src/services/companyProfileService");
jest.mock("../../../../../../src/lib/Logger");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const validateClearFormSpy: jest.SpyInstance = jest.spyOn(genericValidation, "validateClearForm");
const getCompanyProfileSpy: jest.SpyInstance = jest.spyOn(companyProfileService, "getCompanyProfile");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const req: Request = mockRequest();
const res: Response = mockResponse();

describe("AddCompanyHandler", () => {
    const addCompanyHandler: AddCompanyHandler = new AddCompanyHandler();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each([
        {
            condition: "company is awaiting association with user",
            referer: "/your-companies",
            isClearForm: true,
            method: constants.POST,
            body: { companyNumber: validActiveCompanyProfile.companyNumber },
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: validActiveCompanyProfile,
            isAssociated: {
                state: AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER,
                associationId: "12345678"
            },
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber
            }
        },
        {
            condition: "company is not associated with user",
            referer: "/your-companies",
            isClearForm: true,
            method: constants.POST,
            body: { companyNumber: validActiveCompanyProfile.companyNumber },
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: validActiveCompanyProfile,
            isAssociated: {
                state: AssociationState.COMPANY_NOT_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber
            }
        },
        {
            condition: "company was associated with user",
            referer: "/your-companies",
            isClearForm: true,
            method: constants.POST,
            body: { companyNumber: validActiveCompanyProfile.companyNumber },
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: validActiveCompanyProfile,
            isAssociated: {
                state: AssociationState.COMPANY_WAS_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber
            }
        },
        {
            condition: "company is associated with user",
            referer: "/your-companies",
            isClearForm: true,
            method: constants.POST,
            body: { companyNumber: validActiveCompanyProfile.companyNumber },
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: validActiveCompanyProfile,
            isAssociated: {
                state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber,
                errors: { companyNumber: { text: constants.THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT } }
            }
        },
        {
            condition: "company is disolved",
            referer: "/your-companies",
            isClearForm: true,
            method: constants.POST,
            body: { companyNumber: validDisolvedCompanyProfile.companyNumber },
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: validDisolvedCompanyProfile,
            isAssociated: {
                state: AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER,
                associationId: "12345678"
            },
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validDisolvedCompanyProfile.companyNumber,
                errors: { companyNumber: { text: constants.ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE } }
            }
        },
        {
            condition: "company is associated with user",
            referer: "/your-companies",
            isClearForm: true,
            method: constants.GET,
            body: {},
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: validActiveCompanyProfile,
            isAssociated: {
                state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            proposedCompanyNumber: validActiveCompanyProfile.companyNumber,
            currentCompanyNumber: "",
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber,
                errors: { companyNumber: { text: constants.THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT } }
            }
        }
    ])("should return expected viewData object if method is $method and $condition",
        async ({
            referer,
            isClearForm,
            body,
            query,
            companyProfile,
            method,
            isAssociated,
            viewData,
            proposedCompanyNumber,
            currentCompanyNumber
        }) => {
            // Given
            req.headers.referer = referer;
            req.body = body;
            req.query = query;
            getTranslationsForViewSpy.mockReturnValue({ test: "Test" });
            validateClearFormSpy.mockReturnValue(isClearForm);
            getExtraDataSpy
                .mockReturnValueOnce(proposedCompanyNumber)
                .mockReturnValueOnce(companyProfile)
                .mockReturnValueOnce(currentCompanyNumber);
            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
            getCompanyProfileSpy.mockReturnValue(companyProfile);
            // When
            const response = await addCompanyHandler.execute(req, res, method);
            // Then
            expect(response).toEqual(viewData);
        });
});
