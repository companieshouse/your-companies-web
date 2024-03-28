import { redirectPage } from "../../../../src/lib/utils/referrerUtils";

describe("redirectPage", () => {

    const hrefA = "hrefA.com";
    const hrefB = "hrefB.com";
    const hrefC = "hrefC.com";
    const indicator = false;
    const referrer = "referrer.com";

    it("should return false if '/' has been removed from the end of url and urls are equal", () => {
        // Given
        const urlWithSlash = "testUrl.com/";
        const urlWithoutSlash = "testUrl.com";
        // When
        const result = redirectPage(urlWithSlash, urlWithoutSlash, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return false when referrer equals one of the other url parameters", () => {
        // Given
        const referrerOne = "hrefA.com";
        const referrerTwo = "hrefB.com";
        const referrerThree = "hrefC.com";
        // When
        const resultOne = redirectPage(referrerOne, hrefA, hrefB, indicator, hrefC);
        const resultTwo = redirectPage(referrerTwo, hrefA, hrefB, indicator, hrefC);
        const resultThree = redirectPage(referrerThree, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(resultOne).toEqual(false);
        expect(resultTwo).toEqual(false);
        expect(resultThree).toEqual(false);
    });

    it("should return false when parameter urls contain a query parameter", () => {
        // Given
        const referrerOne = "hrefA.com?language";
        const referrerTwo = "hrefB.com?language";
        const referrerThree = "hrefC.com?language";
        // When
        const resultOne = redirectPage(referrerOne, hrefA, hrefB, indicator, hrefC);
        const resultTwo = redirectPage(referrerTwo, hrefA, hrefB, indicator, hrefC);
        const resultThree = redirectPage(referrerThree, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(resultOne).toEqual(false);
        expect(resultTwo).toEqual(false);
        expect(resultThree).toEqual(false);
    });

    it("should return false when parameter urls contain an query parameter with an ampersand (&)", () => {
        // Given
        const referrerOne = "hrefA.com?query&language";
        const referrerTwo = "hrefB.com?query&language";
        const referrerThree = "hrefC.com?query&language";
        // When
        const resultOne = redirectPage(referrerOne, hrefA, hrefB, indicator, hrefC);
        const resultTwo = redirectPage(referrerTwo, hrefA, hrefB, indicator, hrefC);
        const resultThree = redirectPage(referrerThree, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(resultOne).toEqual(false);
        expect(resultTwo).toEqual(false);
        expect(resultThree).toEqual(false);
    });

    it("should return false when the page indicator is true", () => {
        // Given
        const indicator = true;
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(false);
    });

    it("should return true if none of the parameter urls equal the referrer url", () => {
        // Given
        const referrer = "testUrl.com";
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(true);
    });

    it("should return true if the referrer parameter equals 'undefined'", () => {
        // Given
        const referrer = undefined;
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(true);
    });
});
