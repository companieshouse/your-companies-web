import { formatterValidActiveCompanyProfile, validActiveCompanyProfile } from "../../../../mocks/companyProfile.mock";
import { buildAddress, formatForDisplay, formatTitleCase } from "../../../../../src/lib/utils/confirmCompanyUtils";

describe("formatForDisplay", () => {
    it("should return company profile formatted for display", () => {
        // Given
        const lang = "en";
        // When
        const result = formatForDisplay(validActiveCompanyProfile, lang);
        // Then
        expect(result).toEqual(formatterValidActiveCompanyProfile);
    });

    it("should return company profile formatted for display when po box and postal code not provided", () => {
        // Given
        const lang = "en";
        const companyProfile = { ...validActiveCompanyProfile };
        const companyAddress = { ...validActiveCompanyProfile.registeredOfficeAddress, poBox: undefined!, postalCode: undefined! };
        companyProfile.registeredOfficeAddress = companyAddress;
        const expectedFormattedCompanyProfile = { ...formatterValidActiveCompanyProfile };
        const expectedCompanyAddress = { ...formatterValidActiveCompanyProfile.registeredOfficeAddress, poBox: "", postalCode: "" };
        expectedFormattedCompanyProfile.registeredOfficeAddress = expectedCompanyAddress;
        // When
        const result = formatForDisplay(companyProfile, lang);
        // Then
        expect(result).toEqual(expectedFormattedCompanyProfile);
    });
});

describe("formatTitleCase", () => {

    test.each([
        // Given
        {
            returnInfo: "new string with upper case first letter",
            condition: "string provided",
            text: "something",
            expectedText: "Something"
        },
        {
            returnInfo: "empty string",
            condition: "string not provided",
            text: undefined,
            expectedText: ""
        },
        {
            returnInfo: "empty string",
            condition: "an empty string provided",
            text: "",
            expectedText: ""
        }
    ])("should return $returnInfo if $condition",
       ({ text, expectedText }) => {
           // When
           const result = formatTitleCase(text);
           // Then
           expect(result).toEqual(expectedText);
       });
});

describe("buildAddress", () => {
    it("should return address string with <br> tags", () => {
        // Given
        const expectedAddress = "123<br>premises<br>Line1<br>Line2<br>Locality<br>Region<br>Uk<br>POST CODE";
        // When
        const result = buildAddress(formatterValidActiveCompanyProfile);
        // Then
        expect(result).toEqual(expectedAddress);
    });
});
