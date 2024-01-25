import { Session } from "@companieshouse/node-session-handler";
import { getSessionRequestWithPermission, userMail } from "../../../mocks/session.mock";
import { getLoggedInUserEmail } from "../../../../src/lib/utils/sessionUtils";

describe("Session Utils", () => {
    describe("getLoggedInUserEmail", () => {
        const testSessionWithPermission: Session = getSessionRequestWithPermission();
        it("should return user email address if user is logged in", () => {
            expect(getLoggedInUserEmail(testSessionWithPermission)).toEqual(userMail);
        });

        it("should return undefined instead of user email address if user is not logged in", () => {
            expect(getLoggedInUserEmail(undefined)).toBeUndefined;
        });

        it("should return undefined instead of user email address if session data is missing", () => {
            expect(getLoggedInUserEmail(new Session())).toBeUndefined;
        });
    });
});
