import * as translations from "../../../../../../src/lib/utils/translations";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";
import * as constants from "../../../../../../src/constants";
import * as confirmCompanyUtils from "../../../../../../src/lib/utils/confirmCompanyUtils";
import { ConfirmCorrectCompanyHandler } from "../../../../../../src/routers/handlers/yourCompanies/confirmCorrectCompanyHandler";
import { validActiveCompanyProfile } from "../../../../../mocks/companyProfile.mock";
import { i18nCh } from "@companieshouse/ch-node-utils";

const getResourceBundleMock = jest.fn();
const getInstanceSpy: jest.SpyInstance = jest.spyOn(i18nCh, "getInstance");
const formatForDisplaySpy: jest.SpyInstance = jest.spyOn(confirmCompanyUtils, "formatForDisplay");
const buildAddressSpy: jest.SpyInstance = jest.spyOn(confirmCompanyUtils, "buildAddress");
const getFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getFullUrl");
const getTranslationsForViewSpy: jest.SpyInstance = jest.spyOn(translations, "getTranslationsForView");

describe("ConfirmCorrectCompanyHandler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should return view data", async () => {
        // Given
        const url = `${constants.LANDING_URL}/${constants.ADD_COMPANY_PAGE}`;
        getFullUrlSpy.mockReturnValue(url);
        const lang = "en";
        const i18nChInstance = {
            getResourceBundle: getResourceBundleMock
        };
        getInstanceSpy.mockReturnValue(i18nChInstance);
        const address = "address";
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
            backLinkHref: url,
            backLinkWithClearForm: url + constants.CLEAR_FORM_TRUE,
            lang: translations,
            companyProfile: formattedCompanyProfile,
            registeredOfficeAddress: address
        };
        const confirmCorrectCompanyHandler = new ConfirmCorrectCompanyHandler();
        // When
        const response = await confirmCorrectCompanyHandler.execute(lang, validActiveCompanyProfile);
        // Then
        expect(getFullUrlSpy).toHaveBeenCalledTimes(2);
        expect(getFullUrlSpy).toHaveBeenCalledWith(constants.ADD_COMPANY_URL);
        expect(getResourceBundleMock).toHaveBeenCalled();
        expect(getResourceBundleMock).toHaveBeenCalledWith(lang, constants.COMPANY_STATUS);
        expect(getResourceBundleMock).toHaveBeenCalledWith(lang, constants.COMPANY_TYPE);
        expect(formatForDisplaySpy).toHaveBeenCalledTimes(1);
        expect(formatForDisplaySpy).toHaveBeenCalledWith(validActiveCompanyProfile, lang);
        expect(buildAddressSpy).toHaveBeenCalledTimes(1);
        expect(buildAddressSpy).toHaveBeenCalledWith(formattedCompanyProfile);
        expect(getTranslationsForViewSpy).toHaveBeenCalledTimes(1);
        expect(getTranslationsForViewSpy).toHaveBeenCalledWith(lang, constants.CONFIRM_COMPANY_PAGE);
        expect(response).toEqual(viewData);
    });
});
