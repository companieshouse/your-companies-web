import { determineCheckedReferrer, determinePageIndicator } from "../../../../../src/lib/utils/navigationUtils";
import { deleteExtraData } from "../../../../../src/lib/utils/sessionUtils";
import { isReferrerIncludes } from "../../../../../src/lib/utils/urlUtils";
import * as constants from "../../../../../src/constants";
import { Request } from "express";

jest.mock("../../../../../src/lib/utils/sessionUtils", () => ({
    deleteExtraData: jest.fn()
}));

jest.mock("../../../../../src/lib/utils/urlUtils", () => ({
    isReferrerIncludes: jest.fn()
}));

describe("navigationUtils", () => {
    describe("determineCheckedReferrer", () => {
        it("should return hrefA if referrer exists and isReferrerIncludes returns true", () => {
            (isReferrerIncludes as jest.Mock).mockReturnValue(true);
            const referrer = "http://example.com";
            const hrefA = "http://another-example.com";

            const result = determineCheckedReferrer(referrer, hrefA);

            expect(result).toBe(hrefA);
            expect(isReferrerIncludes).toHaveBeenCalledWith(referrer);
        });

        it("should return referrer if isReferrerIncludes returns false", () => {
            (isReferrerIncludes as jest.Mock).mockReturnValue(false);
            const referrer = "http://example.com";
            const hrefA = "http://another-example.com";

            const result = determineCheckedReferrer(referrer, hrefA);

            expect(result).toBe(referrer);
            expect(isReferrerIncludes).toHaveBeenCalledWith(referrer);
        });

        it("should return undefined if referrer is undefined", () => {
            const referrer = undefined;
            const hrefA = "http://another-example.com";

            const result = determineCheckedReferrer(referrer, hrefA);

            expect(result).toBeUndefined();
        });
    });

    describe("determinePageIndicator", () => {
        it("should return true if companyNumber matches pageIndicator and userEmail is in userEmails", () => {
            const companyNumber = "12345";
            const pageIndicator = "12345";
            const userEmails = ["test@example.com"];
            const userEmail = "test@example.com";
            const req = { session: {} } as Request;

            const result = determinePageIndicator(companyNumber, pageIndicator, userEmails, userEmail, req);

            expect(result).toBe(true);
            expect(deleteExtraData).not.toHaveBeenCalled();
        });

        it("should return pageIndicator and call deleteExtraData if companyNumber does not match pageIndicator", () => {
            const companyNumber = "12345";
            const pageIndicator = "67890";
            const userEmails = ["test@example.com"];
            const userEmail = "test@example.com";
            const req = { session: {} } as Request;

            const result = determinePageIndicator(companyNumber, pageIndicator, userEmails, userEmail, req);

            expect(result).toBe(pageIndicator);
            expect(deleteExtraData).toHaveBeenCalledWith(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
        });

        it("should return pageIndicator and call deleteExtraData if userEmail is not in userEmails", () => {
            const companyNumber = "12345";
            const pageIndicator = "12345";
            const userEmails = ["another@example.com"];
            const userEmail = "test@example.com";
            const req = { session: {} } as Request;

            const result = determinePageIndicator(companyNumber, pageIndicator, userEmails, userEmail, req);

            expect(result).toBe(pageIndicator);
            expect(deleteExtraData).toHaveBeenCalledWith(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
        });
    });
});
