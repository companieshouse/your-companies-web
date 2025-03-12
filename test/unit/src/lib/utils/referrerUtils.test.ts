import { redirectPage } from "../../../../../src/lib/utils/referrerUtils";

describe("redirectPage", () => {
    it.each([
        // Given
        [false, "if both urls are equal after function executes", "testUrl.com/", "testUrl.com", "hrefB.com", false, ["hrefC.com"]],
        [false, "when the referrer equals hrefA parameter", "hrefA.com", "hrefA.com", "hrefB.com", false, ["hrefC.com"]],
        [false, "when the referrer equals hrefB parameter", "hrefB.com", "hrefA.com", "hrefB.com", false, ["hrefC.com"]],
        [false, "when the referrer equals hrefC parameter", "hrefC.com", "hrefA.com", "hrefB.com", false, ["hrefC.com"]],
        [false, "when the page indicator is true and none of the url parameters equal the referrer url", "referrer.com", "hrefA.com", "hrefB.com", true, ["hrefC.com"]],
        [false, "when referrer url equals hrefA but with a query parameter", "hrefA.com?language", "hrefA.com", "hrefB.com", false, ["hrefC.com"]],
        [false, "when referrer url equals hrefB but with a query parameter", "hrefB.com?language", "hrefA.com", "hrefB.com", false, ["hrefC.com"]],
        [false, "when referrer url equals hrefC but with a query parameter", "hrefC.com?language", "hrefA.com", "hrefB.com", false, ["hrefC.com"]],
        [false, "when referrer url equals hrefA but with an ampersand (&)", "hrefA.com&language", "hrefA.com", "hrefB.com", false, ["hrefC.com"]],
        [false, "when referrer url equals hrefB but with an ampersand (&)", "hrefB.com&language", "hrefA.com", "hrefB.com", false, ["hrefC.com"]],
        [false, "when referrer url equals hrefC but with an ampersand (&)", "hrefC.com&language", "hrefA.com", "hrefB.com", false, ["hrefC.com"]],
        [true, "if none of the parameter urls equal the referrer url and page indicator equals false", "testUrl.com", "hrefA.com", "hrefB.com", false, ["hrefC.com"]],
        [true, "if the referrer parameter is undefined", undefined, "hrefA.com", "hrefB.com", false, ["hrefC.com"]],
        [false, "when the page indicator is true", undefined, "hrefA.com", "hrefB.com", true, ["hrefC.com"]]
    ])("should return %s %s", (expectedResult, _conditionInfo, referrer, hrefA, hrefB, indicator, hrefC) => {
        // When
        const result = redirectPage(referrer, hrefA, hrefB, indicator, hrefC);
        // Then
        expect(result).toEqual(expectedResult);
    });
});
