import { Request, Response } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as genericValidation from "../../../../../../src/lib/validation/generic";
import * as companyProfileService from "../../../../../../src/services/companyProfileService";
import * as associationsService from "../../../../../../src/services/associationsService";
import * as constants from "../../../../../../src/constants";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { mockResponse } from "../../../../../mocks/response.mock";
import { validActiveCompanyProfile, validDisolvedCompanyProfile } from "../../../../../mocks/companyProfile.mock";
import { AssociationState } from "../../../../../../src/types/associations";
import { AddCompanyHandler } from "../../../../../../src/routers/handlers/yourCompanies/addCompanyHandler";
import { Session } from "@companieshouse/node-session-handler";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";

jest.mock("../../../../../../src/services/companyProfileService");
jest.mock("../../../../../../src/lib/Logger");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const validateClearFormSpy: jest.SpyInstance = jest.spyOn(genericValidation, "validateClearForm");
const getCompanyProfileSpy: jest.SpyInstance = jest.spyOn(companyProfileService, "getCompanyProfile");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const res: Response = mockResponse();

describe("AddCompanyHandler", () => {
    let addCompanyHandler: AddCompanyHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        addCompanyHandler = new AddCompanyHandler();
    });

    test.each([
        {
            condition: "company is awaiting association with user",
            referer: "/your-companies",
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
        },
        {
            condition: "company is disolved",
            referer: "/your-companies",
            method: constants.GET,
            body: {},
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: validDisolvedCompanyProfile,
            isAssociated: {
                state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            proposedCompanyNumber: validDisolvedCompanyProfile.companyNumber,
            currentCompanyNumber: "",
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validDisolvedCompanyProfile.companyNumber,
                errors: { companyNumber: { text: constants.ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE } }
            }
        },
        {
            condition: "company is associated with user and proposed company number not saved in session",
            referer: "/your-companies",
            method: constants.GET,
            body: {},
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: validActiveCompanyProfile,
            isAssociated: {
                state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            proposedCompanyNumber: undefined,
            currentCompanyNumber: "",
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber,
                errors: { companyNumber: { text: constants.THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT } }
            }
        },
        {
            condition: "company is disolved and proposed company number not saved in session",
            referer: "/your-companies",
            method: constants.GET,
            body: {},
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: validDisolvedCompanyProfile,
            isAssociated: {
                state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            proposedCompanyNumber: undefined,
            currentCompanyNumber: "",
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validDisolvedCompanyProfile.companyNumber,
                errors: { companyNumber: { text: constants.ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE } }
            }
        },
        {
            condition: "company is associated with user and referer includes add company url",
            referer: "/your-companies/add-company",
            method: constants.GET,
            body: {},
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: { ...validActiveCompanyProfile, companyNumber: undefined },
            isAssociated: {
                state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            proposedCompanyNumber: undefined,
            currentCompanyNumber: validActiveCompanyProfile.companyNumber,
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber,
                errors: { companyNumber: { text: constants.THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT } }
            }
        },
        {
            condition: "company is disolved and referer includes add company url",
            referer: "/your-companies/add-company",
            method: constants.GET,
            body: {},
            query: { [constants.CLEAR_FORM]: "true" },
            companyProfile: { ...validDisolvedCompanyProfile, companyNumber: undefined },
            isAssociated: {
                state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            proposedCompanyNumber: undefined,
            currentCompanyNumber: validDisolvedCompanyProfile.companyNumber,
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validDisolvedCompanyProfile.companyNumber,
                errors: { companyNumber: { text: constants.ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE } }
            }
        },
        {
            condition: "company profile not found",
            referer: "/your-companies",
            method: constants.POST,
            body: { companyNumber: validActiveCompanyProfile.companyNumber },
            query: { [constants.CLEAR_FORM]: "true" },
            httpError: createError(StatusCodes.NOT_FOUND),
            isAssociated: {
                state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber,
                errors: { companyNumber: { text: constants.ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG } }
            }
        },
        {
            condition: "bad request response",
            referer: "/your-companies",
            method: constants.POST,
            body: { companyNumber: validActiveCompanyProfile.companyNumber },
            query: { [constants.CLEAR_FORM]: "true" },
            httpError: createError(StatusCodes.BAD_REQUEST),
            isAssociated: {
                state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber,
                errors: { companyNumber: { text: constants.ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG } }
            }
        },
        {
            condition: "and forbidden response",
            referer: "/your-companies",
            method: constants.POST,
            body: { companyNumber: validActiveCompanyProfile.companyNumber },
            query: { [constants.CLEAR_FORM]: "true" },
            httpError: createError(StatusCodes.FORBIDDEN),
            isAssociated: {
                state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber,
                errors: { companyNumber: { text: constants.ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG } }
            }
        },
        {
            condition: "and server error response",
            referer: "/your-companies",
            method: constants.POST,
            body: { companyNumber: validActiveCompanyProfile.companyNumber },
            query: { [constants.CLEAR_FORM]: "true" },
            httpError: createError(StatusCodes.INTERNAL_SERVER_ERROR),
            isAssociated: {
                state: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
                associationId: "12345678"
            },
            viewData: {
                templateName: constants.ADD_COMPANY_PAGE,
                backLinkHref: constants.LANDING_URL,
                lang: { test: "Test" },
                proposedCompanyNumber: validActiveCompanyProfile.companyNumber,
                errors: { serverError: { summary: "generic_error_message" } }
            }
        }
    ])("should return expected viewData object if method is $method and $condition",
        async ({
            referer,
            body,
            query,
            companyProfile,
            httpError,
            method,
            isAssociated,
            viewData,
            proposedCompanyNumber,
            currentCompanyNumber
        }) => {
            // Given
            const mockGet = jest.fn().mockReturnValue(referer);
            const req: Request = mockParametrisedRequest(
                { body, query, get: mockGet, session: new Session() }
            );
            getTranslationsForViewSpy.mockReturnValue({ test: "Test" });
            validateClearFormSpy.mockReturnValue(true);
            getExtraDataSpy
                .mockReturnValueOnce(proposedCompanyNumber)
                .mockReturnValueOnce(companyProfile)
                .mockReturnValueOnce(currentCompanyNumber);
            isOrWasCompanyAssociatedWithUserSpy.mockReturnValue(isAssociated);
            if (!httpError) {
                getCompanyProfileSpy.mockReturnValue(companyProfile);
            } else {
                getCompanyProfileSpy.mockRejectedValue(httpError);
            }

            // When
            const response = await addCompanyHandler.execute(req, res, method);
            // Then
            expect(response).toEqual(viewData);
        });
});
