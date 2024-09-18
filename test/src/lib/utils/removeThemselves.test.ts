import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { isRemovingThemselves } from "../../../../src/lib/utils/removeThemselves";

const getLoggedInUserEmailSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserEmail");
const session = new Session();

describe("isRemovingThemselves", () => {
    it("should return true if removal email is logged in user email", () => {
        // Give
        const removalEmail = "test@test.com";
        getLoggedInUserEmailSpy.mockReturnValue(removalEmail);
        // When
        const result = isRemovingThemselves(session, removalEmail);
        // Then
        expect(result).toBeTruthy();
    });

    it("should return false if removal email is not logged in user email", () => {
        // Give
        const removalEmail = "test@test.com";
        getLoggedInUserEmailSpy.mockReturnValue("j.smith@test.com");
        // When
        const result = isRemovingThemselves(session, removalEmail);
        // Then
        expect(result).toBeFalsy();
    });
});
