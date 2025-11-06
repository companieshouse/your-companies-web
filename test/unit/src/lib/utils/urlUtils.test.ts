import {
    addLangToUrl,
    getAddPresenterFullUrl,
    getAddPresenterUrl,
    getCheckPresenterFullUrl,
    getCheckPresenterUrl,
    getCompanyInvitationsAcceptFullUrl,
    getCompanyInvitationsDeclineFullUrl,
    getCompanyAddedSuccessFullUrl,
    getFullUrl,
    getManageAuthorisedPeopleFullUrl,
    getManageAuthorisedPeopleUrl,
    isWhitelistedUrl
} from "../../../../../src/lib/utils/urlUtils";
import * as constants from "../../../../../src/constants";

describe("addLangToUrl", () => {
    it.each([
        // Given
        ["return unmodified url if lang parameter is undefined", "website.com", undefined, "website.com"],
        ["return unmodified url if lang parameter is empty string", "website.com", "", "website.com"],
        ["replace Welsh language parameter in url to English if lang parameter is English", "website.com?lang=cy", "en", "website.com?lang=en"],
        ["replace English language parameter in url to Welsh if lang parameter is Welsh", "website.com?lang=en", "cy", "website.com?lang=cy"],
        ["replace '?' parameter in url to '&' if url already contains a query parameter", "website.com?userName=Jimmy%20Spice", "en", "website.com?userName=Jimmy%20Spice&lang=en"],
        ["add a language parameter to the url if the url doesn't already contain a query parameter", "website.com", "en", "website.com?lang=en"],
        ["change cf from true to false if included", "http://www.website.com/your-companies?cf=true", undefined, "http://www.website.com/your-companies?cf=false"]
    ])("should %s", (_testInfo, url, lang, expectedUrl) => {
        // When
        const result = addLangToUrl(url, lang);
        // Then
        expect(result).toEqual(expectedUrl);
    });
});

describe("isWhitelistedUrl", () => {
    it("Should return true when url in the allow list", () => {
        // Given
        const url = "/your-companies/healthcheck";
        // When
        const result = isWhitelistedUrl(url);
        // Then
        expect(result).toBeTruthy();
    });

    it("Should return false when url is not in the allow list", () => {
        // Given
        const url = "/your-companies/healthcheckbad";
        // When
        const result = isWhitelistedUrl(url);
        // Then
        expect(result).toBeFalsy();
    });

    it("Should return false when url is not an exact match", () => {
        // Given
        const url = "/healthcheck";
        // When
        const result = isWhitelistedUrl(url);
        // Then
        expect(result).toBeFalsy();
    });
});

describe("URL generation function", () => {

    test.each([
        // Given
        ["getFullUrl", `${constants.LANDING_URL}/test/path`, "/test/path", getFullUrl],
        ["getAddPresenterUrl", `/${constants.ADD_PRESENTER_PAGE}/12345`, "12345", getAddPresenterUrl],
        ["getAddPresenterFullUrl", `${constants.LANDING_URL}/${constants.ADD_PRESENTER_PAGE}/12345`, "12345", getAddPresenterFullUrl],
        ["getCompanyInvitationsAcceptFullUrl", `${constants.LANDING_URL}/${constants.COMPANY_INVITATIONS_ACCEPT_PAGE}/abc123`, "abc123", getCompanyInvitationsAcceptFullUrl],
        ["getCompanyInvitationsDeclineFullUrl", `${constants.LANDING_URL}/${constants.COMPANY_INVITATIONS_DECLINE_PAGE}/abc123`, "abc123", getCompanyInvitationsDeclineFullUrl],
        ["getCheckPresenterUrl", `/${constants.CHECK_PRESENTER_PAGE}/abc123`, "abc123", getCheckPresenterUrl],
        ["getCheckPresenterFullUrl", `${constants.LANDING_URL}/${constants.CHECK_PRESENTER_PAGE}/abc123`, "abc123", getCheckPresenterFullUrl],
        ["getCompanyAddedSuccessFullUrl", `${constants.LANDING_URL}/company/abc123/confirmation-company-added`, "abc123", getCompanyAddedSuccessFullUrl],
        [
            "getFullUrl",
            `${constants.LANDING_URL}/test/path`,
            "/test/path",
            getFullUrl
        ],
        [
            "getAddPresenterUrl",
            `/${constants.ADD_PRESENTER_PAGE}/12345`,
            "12345",
            getAddPresenterUrl
        ],
        [
            "getAddPresenterFullUrl",
            `${constants.LANDING_URL}/${constants.ADD_PRESENTER_PAGE}/12345`,
            "12345",
            getAddPresenterFullUrl
        ],
        [
            "getCompanyInvitationsAcceptFullUrl",
            `${constants.LANDING_URL}/${constants.COMPANY_INVITATIONS_ACCEPT_PAGE}/abc123`,
            "abc123",
            getCompanyInvitationsAcceptFullUrl
        ],
        [
            "getCompanyInvitationsDeclineFullUrl",
            `${constants.LANDING_URL}/${constants.COMPANY_INVITATIONS_DECLINE_PAGE}/abc123`,
            "abc123",
            getCompanyInvitationsDeclineFullUrl
        ],
        [
            "getCheckPresenterUrl",
            `/${constants.CHECK_PRESENTER_PAGE}/abc123`,
            "abc123",
            getCheckPresenterUrl
        ],
        [
            "getCheckPresenterFullUrl",
            `${constants.LANDING_URL}/${constants.CHECK_PRESENTER_PAGE}/abc123`,
            "abc123",
            getCheckPresenterFullUrl
        ],
        [
            "getCompanyAddedSuccessFullUrl",
            `${constants.LANDING_URL}/company/abc123/confirmation-company-added`,
            "abc123",
            getCompanyAddedSuccessFullUrl
        ],
        [
            "getManageAuthorisedPeopleUrl",
            `/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/abc123`,
            "abc123",
            getManageAuthorisedPeopleUrl
        ],
        [
            "getManageAuthorisedPeopleFullUrl",
            `${constants.LANDING_URL}/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/abc123`,
            "abc123",
            getManageAuthorisedPeopleFullUrl
        ]
    ])("%s should generate URL: '%s'",
       (_functionName, expectedFullUrl, argument, testedFunction) => {
           // When
           const result = testedFunction(argument);
           // Then
           expect(result).toEqual(expectedFullUrl);
       });
});
