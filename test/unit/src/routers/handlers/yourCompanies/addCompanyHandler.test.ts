import { Request, Response } from "express";
import * as translations from "../../../../../../src/lib/utils/translations";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as genericValidation from "../../../../../../src/lib/validation/generic";
import * as companyProfileService from "../../../../../../src/services/companyProfileService";
import * as associationsService from "../../../../../../src/services/associationsService";
import * as constants from "../../../../../../src/constants";
import { mockRequest } from "../../../../../mocks/request.mock";
import { mockResponse } from "../../../../../mocks/response.mock";
import { validActiveCompanyProfile } from "../../../../../mocks/companyProfile.mock";
import { AssociationState } from "../../../../../../src/types/associations";
import { AddCompanyHandler } from "../../../../../../src/routers/handlers/yourCompanies/addCompanyHandler";

jest.mock("../../../../../../src/lib/Logger");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const validateClearFormSpy: jest.SpyInstance = jest.spyOn(genericValidation, "validateClearForm");
const getCompanyProfileSpy: jest.SpyInstance = jest.spyOn(companyProfileService, "getCompanyProfile");
const isOrWasCompanyAssociatedWithUserSpy: jest.SpyInstance = jest.spyOn(associationsService, "isOrWasCompanyAssociatedWithUser");
const req: Request = mockRequest();
const resp: Response = mockResponse();

describe("AddCompanyHandler", () => {
    const addCompanyHandler: AddCompanyHandler = new AddCompanyHandler();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each([
        {
            referer: "",
            isClearForm: false,
            method: constants.POST,
            body: { companyNumber: validActiveCompanyProfile.companyNumber },
            companyProfile: validActiveCompanyProfile,
            isAssociated: { state: AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER }
        }
    ])("",
        async ({ referer, isClearForm, body, companyProfile, method, isAssociated }) => {
            // Given
            req.headers.referer = referer;
            req.body = body;
            getTranslationsForViewSpy.mockReturnValue({});
            validateClearFormSpy.mockReturnValue(isClearForm);
            getCompanyProfileSpy.mockReturnValue(companyProfile);
            // When
            const response = await addCompanyHandler.execute(req, resp, method);
            // Then
        });
});
