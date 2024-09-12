import { formatterValidActiveCompanyProfile, validActiveCompanyProfile } from "../../../mocks/companyProfile.mock";
import { buildAddress, formatForDisplay, formatTitleCase } from "../../../../src/lib/utils/confirmCompanyUtils";

describe("formatForDisplay", () => {
    it("should return company profile formatted for display", () => {
        // Given
        const lang = "en";
        // When
        const result = formatForDisplay(validActiveCompanyProfile, lang);
        // Then
        expect(result).toEqual(formatterValidActiveCompanyProfile);
    });
});

describe("formatTitleCase", () => {
    it("should return new string with upper case first letter if string provided", () => {
        // Given
        const text = "something";
        const expectedText = "Something";
        // When
        const result = formatTitleCase(text);
        // Then
        expect(result).toEqual(expectedText);
    });

    it("should return empty string if string not provided", () => {
        // Given
        const text = undefined;
        const expectedText = "";
        // When
        const result = formatTitleCase(text);
        // Then
        expect(result).toEqual(expectedText);
    });
});

describe("buildAddress", () => {
    it("should return address string with <br> tags", () => {
        // Given
        const expectedAddress = "123<br>premises<br>Line1<br>Line2<br>Locality<br>Region<br>Uk<br>POST CODE<br>";
        // When
        const result = buildAddress(formatterValidActiveCompanyProfile);
        // Then
        expect(result).toEqual(expectedAddress);
    });
});
