import * as translations from "../../../../../../src/lib/utils/translations";
import * as constants from "../../../../../../src/constants";
import * as confirmCompanyUtils from "../../../../../../src/lib/utils/confirmCompanyUtils";
import {
    ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler
} from "../../../../../../src/routers/handlers/yourCompanies/confirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler";
import { validActiveCompanyProfile } from "../../../../../mocks/companyProfile.mock";
import { i18nCh } from "@companieshouse/ch-node-utils";
import { mockParametrisedRequest } from "../../../../../mocks/request.mock";
import { Session } from "@companieshouse/node-session-handler";
import * as companyProfileService from "../../../../../../src/services/companyProfileService";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";

jest.mock("../../../../../../src/services/companyProfileService");
jest.mock("../../../../../../src/lib/utils/sessionUtils");

const getResourceBundleMock = jest.fn();
const getInstanceSpy: jest.SpyInstance = jest.spyOn(i18nCh, "getInstance");
const formatForDisplaySpy: jest.SpyInstance = jest.spyOn(confirmCompanyUtils, "formatForDisplay");
const buildAddressSpy: jest.SpyInstance = jest.spyOn(confirmCompanyUtils, "buildAddress");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");
const getCompanyProfileSpy: jest.SpyInstance = jest.spyOn(companyProfileService, "getCompanyProfile");
const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");

describe("ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should return view data", async () => {
        // Given
        const companyNumber = "12345678";
        const lang = "en";
        const req = mockParametrisedRequest({
            lang,
            session: new Session(),
            requestId: "requestId"
        });
        const i18nChInstance = {
            getResourceBundle: getResourceBundleMock
        };
        getInstanceSpy.mockReturnValue(i18nChInstance);
        const address = "address";
        getCompanyProfileSpy.mockReturnValue(validActiveCompanyProfile);
        const formattedCompanyProfile = {
            companyNumber: validActiveCompanyProfile.companyNumber,
            companyName: validActiveCompanyProfile.companyName,
            type: validActiveCompanyProfile.type,
            companyStatus: validActiveCompanyProfile.companyStatus,
            dateOfCreation: "1 January 2024",
            registeredOfficeAddress: address
        };
        formatForDisplaySpy.mockReturnValue(formattedCompanyProfile);
        const translations = { key: "value" };
        getTranslationsForViewSpy.mockReturnValue(translations);
        getResourceBundleMock.mockReturnValue({});
        buildAddressSpy.mockReturnValue(address);
        const viewData = {
            templateName: constants.CONFIRM_COMPANY_PAGE,
            backLinkHref: constants.LANDING_URL,
            backLinkWithClearForm: constants.LANDING_URL + constants.CLEAR_FORM_TRUE,
            lang: translations,
            companyProfile: formattedCompanyProfile,
            registeredOfficeAddress: address
        };
        const confirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler = new ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler();
        // When
        const response = await confirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler.execute(req, companyNumber);
        // Then
        expect(getResourceBundleMock).toHaveBeenCalled();
        expect(getResourceBundleMock).toHaveBeenCalledWith(lang, constants.COMPANY_STATUS);
        expect(getResourceBundleMock).toHaveBeenCalledWith(lang, constants.COMPANY_TYPE);
        expect(getCompanyProfileSpy).toHaveBeenCalledTimes(1);
        expect(getCompanyProfileSpy).toHaveBeenCalledWith(companyNumber, "requestId");
        expect(setExtraDataSpy).toHaveBeenCalledTimes(1);
        expect(setExtraDataSpy).toHaveBeenCalledWith(expect.any(Session), `${constants.COMPANY_PROFILE}_${companyNumber}`, validActiveCompanyProfile);
        expect(formatForDisplaySpy).toHaveBeenCalledTimes(1);
        expect(formatForDisplaySpy).toHaveBeenCalledWith(validActiveCompanyProfile, lang);
        expect(buildAddressSpy).toHaveBeenCalledTimes(1);
        expect(buildAddressSpy).toHaveBeenCalledWith(formattedCompanyProfile);
        expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
        expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.CONFIRM_COMPANY_PAGE);
        expect(response).toEqual(viewData);
    });
});
