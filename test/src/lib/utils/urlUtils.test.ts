import { addLangToUrl, getManageAuthorisedPeopleUrl, isReferrerIncludes } from "../../../../src/lib/utils/urlUtils";

describe("addLangToUrl", () => {
    it.each([
        // Given
        ["should return unmodified url if lang parameter is undefined", "website.com", undefined, "website.com"],
        ["should return unmodified url if lang parameter is empty string", "website.com", "", "website.com"],
        ["should replace Welsh language parameter in url to English if lang parameter is English", "website.com?lang=cy", "en", "website.com?lang=en"],
        ["should replace English language parameter in url to Welsh if lang parameter is Welsh", "website.com?lang=en", "cy", "website.com?lang=cy"],
        ["should replace '?' parameter in url to '&' if url already contains a query parameter", "website.com?userName=Jimmy%20Spice", "en", "website.com?userName=Jimmy%20Spice&lang=en"],
        ["should add a language parameter to the url if the url doesn't already contain a query parameter", "website.com", "en", "website.com?lang=en"],
        ["should change cf from true to false if included", "http://www.website.com/your-companies?cf=true", undefined, "http://www.website.com/your-companies?cf=false"]
    ])("%s", (_testInfo, url, lang, expectedUrl) => {
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
        expect(getManageAuthorisedPeopleUrl(url, companyNumber)).toEqual(expected);
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
