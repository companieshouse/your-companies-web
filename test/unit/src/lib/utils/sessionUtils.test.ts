import { Session } from "@companieshouse/node-session-handler";
import {
    getSessionRequestWithPermission,
    standardUserSessionMock,
    userMail
} from "../../../../mocks/session.mock";
import {
    deleteExtraData,
    getAccessToken,
    getExtraData,
    getLoggedInUserEmail,
    getRefreshToken,
    setAccessToken,
    setExtraData
} from "../../../../../src/lib/utils/sessionUtils";

describe("Session Utils", () => {
    describe("getLoggedInUserEmail", () => {
        test.each([
            // Given
            {
                returnInfo: "email address",
                condition: "user is logged in",
                session: getSessionRequestWithPermission(),
                expectedResult: userMail
            },
            {
                returnInfo: "undefined instead of user email address",
                condition: "user is not logged in",
                session: undefined,
                expectedResult: undefined
            },
            {
                returnInfo: "undefined instead of user email address",
                condition: "session data is missing",
                session: new Session(),
                expectedResult: undefined
            }
        ])("should return $returnInfo if $condition",
            ({ session, expectedResult }) => {
                // When
                const result = getLoggedInUserEmail(session);
                // Then
                expect(result).toEqual(expectedResult);
            });
    });

    describe("setExtraData", () => {
        it("should set extra data to session if provided", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            // When
            setExtraData(session, key, value);
            // Then
            expect(session.data.extra_data[key]).toEqual(value);
        });
    });

    describe("getExtraData", () => {
        it("should return extra data from session if exists", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            session.data.extra_data[key] = value;
            // When
            const result = getExtraData(session, key);
            // Then
            expect(result).toEqual(value);
        });

        it("should return undefined if session is not provided", () => {
            // Given
            const session = undefined;
            const key = "testKey";
            // When
            const result = getExtraData(session, key);
            // Then
            expect(result).toEqual(undefined);
        });

        it("should return undefined if there is no data with the provided key", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            session.data.extra_data[key] = value;
            // When
            const result = getExtraData(session, "test");
            // Then
            expect(result).toEqual(undefined);
        });
    });

    describe("deleteExtraData", () => {
        it("should delete extra data from session if exist", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            setExtraData(session, key, value);
            expect(session.data.extra_data[key]).toEqual(value);
            // When
            const result = deleteExtraData(session, key);
            // Then
            expect(session.data.extra_data[key]).toEqual(undefined);
            expect(result).toBeTruthy();
        });

        it("should not delete extra data from session if exist and wrong key provided", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            setExtraData(session, key, value);
            expect(session.data.extra_data[key]).toEqual(value);
            // When
            const result = deleteExtraData(session, "wrongKey");
            // Then
            expect(session.data.extra_data[key]).toEqual(value);
            expect(result).toBeTruthy();
        });

        it("should not delete extra data from session if session not provided", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            setExtraData(session, key, value);
            expect(session.data.extra_data[key]).toEqual(value);
            // When
            const result = deleteExtraData(undefined, key);
            // Then
            expect(session.data.extra_data[key]).toEqual(value);
            expect(result).toBeFalsy();
        });
    });

    describe("getAccessToken", () => {
        it("should return access token from session if exist", () => {
            // Given
            const accessToken = "access token";
            const session: Session = new Session();
            (session.data.signin_info as unknown) = { access_token: { access_token: accessToken } };
            // When
            const result = getAccessToken(session);
            // Then
            expect(result).toEqual(accessToken);
        });
    });

    describe("getRefreshToken", () => {
        it("should get refresh token from the session", () => {
            // Given
            const expectedRefreshToken = standardUserSessionMock.data.signin_info?.access_token?.refresh_token;
            // When
            const refreshToken = getRefreshToken(standardUserSessionMock);
            // Then
            expect(refreshToken).toEqual(expectedRefreshToken);
        });
    });

    describe("setAccessToken", () => {
        it("should set access token in the session with the provided one", () => {
            // Given
            const session: Session = getSessionRequestWithPermission();
            const expectedExistingAccessToken = session.data.signin_info?.access_token?.access_token;
            const accessToken = "asdfgzxcv12345";
            // When
            const existingAccessToken = getAccessToken(session);
            setAccessToken(session, accessToken);
            const newAccessToken = getAccessToken(session);
            // Then
            expect(existingAccessToken).toEqual(expectedExistingAccessToken);
            expect(newAccessToken).toEqual(accessToken);
        });

        it("throw an error if signInInfo not available in session", () => {
            // Given
            const session: Session = new Session();
            const accessToken = "asdfgzxcv12345";
            // Then
            expect(() => setAccessToken(session, accessToken))
                .toThrow("SignInInfo not present in the session");
        });
    });
});
