import { redirectPage } from "../../../../src/lib/utils/referrerUtils";

describe("redirectPage", () => {

    const hrefA = "hrefA.com";
    const hrefB = "hrefB.com";
    const hrefC = "hrefC.com";
    const indicator = false;
    const referrer = "referrer.com";

    it("should return false if both urls are equal after function executes", () => {
        // Given
        const urlWithSlash = "testUrl.com/";
        const urlWithoutSlash = "testUrl.com";
        // When
        const result = redirectPage(urlWithSlash, urlWithoutSlash, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when the referrer equals hrefA parameter", () => {
        // Given
        const referrer = "hrefA.com";
        const hrefA = "hrefA.com";
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when the referrer equals hrefB parameter", () => {
        // Given
        const referrer = "hrefB.com";
        const hrefB = "hrefB.com";
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when the referrer equals hrefC parameter", () => {
        // Given
        const referrer = "hrefC.com";
        const hrefC = "hrefC.com";
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when the page indicator is true and none of the url parameters equal the referrer url", () => {
        // Given
        const indicator = true;
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when referrer url equals hrefA but with a query parameter", () => {
        // Given
        const referrer = "hrefA.com?language";
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when referrer url equals hrefB but with a query parameter", () => {
        // Given
        const referrer = "hrefB.com?language";
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when referrer url equals hrefC but with a query parameter", () => {
        // Given
        const referrer = "hrefC.com?language";
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when referrer url equals hrefA but with an ampersand (&)", () => {
        // Given
        const referrer = "hrefA.com&language";
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when referrer url equals hrefB but with an ampersand (&)", () => {
        // Given
        const referrer = "hrefB.com&language";
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when referrer url equals hrefC but with an ampersand (&)", () => {
        // Given
        const referrer = "hrefC.com&language";
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return true if none of the parameter urls equal the referrer url and page indicator equals false", () => {
        // Given
        const referrer = "testUrl.com";
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(true);
    });

    it("should return true if the referrer parameter is undefined", () => {
        // Given
        const referrer = undefined;
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(true);
    });

    it("should always return false when the page indicator is true", () => {
        // Given
        const referrer = undefined;
        const trueIndicator = true;
        // When
        const result = redirectPage(referrer, hrefA, hrefB, trueIndicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });
});
