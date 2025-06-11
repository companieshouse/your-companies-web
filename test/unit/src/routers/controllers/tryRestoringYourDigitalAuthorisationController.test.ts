import { Request, Response } from "express";
import * as constants from "../../../../../src/constants";
import { mockRequest } from "../../../../mocks/request.mock";
import { mockResponse } from "../../../../mocks/response.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import * as associationsService from "../../../../../src/services/associationsService";
import { CompanyNameAndNumber } from "../../../../../src/types/utilTypes";
import { userAssociationWithMrigratedCompanyStatus } from "../../../../mocks/associations.mock";
import {
    tryRestoringYourDigitalAuthorisationControllerGet
} from "../../../../../src/routers/controllers/tryRestoringYourDigitalAuthorisationController";

jest.mock("../../../../../src/lib/utils/sessionUtils");
jest.mock("../../../../../src/services/associationsService");
jest.mock("../../../../../src/lib/Logger");

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const createAssociationSpy: jest.SpyInstance = jest.spyOn(associationsService, "createAssociation");

const req: Request = mockRequest();
req.session = new Session();
const res: Response = mockResponse();

describe("tryRestoringYourDigitalAuthorisationControllerGet", () => {
    it("should redirect to the confirmation page when digital authorisation restored", async () => {
        // Given
        const confirmedCompanyForAssociation: CompanyNameAndNumber = {
            companyName: userAssociationWithMrigratedCompanyStatus.items[0].companyName,
            companyNumber: userAssociationWithMrigratedCompanyStatus.items[0].companyNumber
        };
        getExtraDataSpy.mockReturnValue(confirmedCompanyForAssociation);
        // When
        await tryRestoringYourDigitalAuthorisationControllerGet(req, res);
        // Then
        expect(getExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(getExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
        expect(createAssociationSpy).toHaveBeenCalledTimes(1);
        expect(createAssociationSpy).toHaveBeenCalledWith(req, confirmedCompanyForAssociation.companyNumber);
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith(`${constants.LANDING_URL}${(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL)}`);
    });
});
