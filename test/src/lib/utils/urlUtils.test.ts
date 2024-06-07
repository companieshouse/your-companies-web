import { addLangToUrl, getManageAuthorisedPeopleUrl } from "../../../../src/lib/utils/urlUtils";

describe("addLangToUrl", () => {
    it("should return unmodified url if lang parameter is undefined", () => {
        // Given
        const url = "website.com";
        const lang = undefined;
        // When
        const result = addLangToUrl(url, lang);
        // Then
        expect(result).toEqual(url);
    });

    it("should return unmodified url if lang parameter is empty string", () => {
        // Given
        const url = "website.com";
        const lang = "";
        // When
        const result = addLangToUrl(url, lang);
        // Then
        expect(result).toEqual(url);
    });

    it("should replace Welsh language parameter in url to English if lang parameter is English", () => {
        // Given
        const url = "website.com?lang=cy";
        const lang = "en";
        const expectedUrl = "website.com?lang=en";
        // When
        const result = addLangToUrl(url, lang);
        // Then
        expect(result).toEqual(expectedUrl);
    });

    it("should replace English language parameter in url to Welsh if lang parameter is Welsh", () => {
        // Given
        const url = "website.com?lang=en";
        const lang = "cy";
        const expectedUrl = "website.com?lang=cy";
        // When
        const result = addLangToUrl(url, lang);
        // Then
        expect(result).toEqual(expectedUrl);
    });

    it("should replace '?' parameter in url to '&' if url already contains a query parameter", () => {
        // Given
        const url = "website.com?userName=Jimmy%20Spice";
        const lang = "en";
        const expectedUrl = "website.com?userName=Jimmy%20Spice&lang=en";
        // When
        const result = addLangToUrl(url, lang);
        // Then
        expect(result).toEqual(expectedUrl);
    });

    it("should add a language parameter to the url if the url doesn't already contain a query parameter", () => {
        // Given
        const url = "website.com";
        const lang = "en";
        const expectedUrl = "website.com?lang=en";
        // When
        const result = addLangToUrl(url, lang);
        // Then
        expect(result).toEqual(expectedUrl);
    });
    it("should change cf from true to false if included", () => {
        // Given
        const url = "http://www.website.com/your-companies?cf=true";
        const lang = undefined;
        // When
        const result = addLangToUrl(url, lang);
        // Then
        const expectedUrl = "http://www.website.com/your-companies?cf=false";
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
