import {
    addLangToUrl,
    getAddPresenterFullUrl,
    getCheckPresenterFullUrl,
    getCompanyInvitationsAcceptFullUrl,
    getCompanyInvitationsDeclineFullUrl,
    getCreateCompanyAssociationFullUrl,
    getFullUrl,
    getManageAuthorisedPeopleFullUrl,
    isReferrerIncludes,
    isWhitelistedUrl
} from "../../../../src/lib/utils/urlUtils";
import * as constants from "../../../../src/constants";

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

describe("getManageAuthorisedPeopleUrl should return correct url", () => {
    it.each([
        { url: "/confirmation-cancel-person", companyNumber: "AB123456", expected: "/your-companies/manage-authorised-people/AB123456/confirmation-cancel-person" },
        { url: "/confirmation-person-removed", companyNumber: "AB123456", expected: "/your-companies/manage-authorised-people/AB123456/confirmation-person-removed" },
        { url: "/authorisation-email-resent", companyNumber: "AB123456", expected: "/your-companies/manage-authorised-people/AB123456/authorisation-email-resent" },
        { url: "/confirmation-person-added", companyNumber: "AB123456", expected: "/your-companies/manage-authorised-people/AB123456/confirmation-person-added" },
        { url: "/any-other-url", companyNumber: "AB123456", expected: "/your-companies/manage-authorised-people/AB123456" }
    ])("should return $expected for $url, $companyNumber", ({ url, companyNumber, expected }) => {
        expect(getManageAuthorisedPeopleFullUrl(url, companyNumber)).toEqual(expected);
    });
});

describe("isReferrerIncludes", () => {
    it.each([
        // Given
        [true, "http://some-service.com/confirmation-person-removed"],
        [true, "http://some-service.com/confirmation-cancel-person"],
        [true, "http://some-service.com/confirmation-person-added"],
        [true, "http://some-service.com/authorisation-email-resent"],
        [false, "http://some-service.com/something-else"]
    ])("should return %s for %s", (expectedResult, referrer) => {
        // When
        const result = isReferrerIncludes(referrer);
        // Then
        expect(result).toEqual(expectedResult);
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
        ["getAddPresenterFullUrl", `${constants.LANDING_URL}/${constants.ADD_PRESENTER_PAGE}/12345`, "12345", getAddPresenterFullUrl],
        ["getCompanyInvitationsAcceptFullUrl", `${constants.LANDING_URL}/${constants.COMPANY_INVITATIONS_ACCEPT_PAGE}/abc123`, "abc123", getCompanyInvitationsAcceptFullUrl],
        ["getCompanyInvitationsDeclineFullUrl", `${constants.LANDING_URL}/${constants.COMPANY_INVITATIONS_DECLINE_PAGE}/abc123`, "abc123", getCompanyInvitationsDeclineFullUrl],
        ["getCheckPresenterFullUrl", `${constants.LANDING_URL}/${constants.CHECK_PRESENTER_PAGE}/abc123`, "abc123", getCheckPresenterFullUrl],
        ["getCreateCompanyAssociationFullUrl", `${constants.LANDING_URL}/company/abc123/create-company-association`, "abc123", getCreateCompanyAssociationFullUrl]
    ])("%s should generate URL: '%s'",
        (_functionName, expectedFullUrl, argument, testedFunction) => {
            // When
            const result = testedFunction(argument);
            // Then
            expect(result).toEqual(expectedFullUrl);
        });
});
