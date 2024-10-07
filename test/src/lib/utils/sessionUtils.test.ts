import { Session } from "@companieshouse/node-session-handler";
import { getSessionRequestWithPermission, userMail } from "../../../mocks/session.mock";
import { deleteExtraData, getAccessToken, getExtraData, getLoggedInUserEmail, setExtraData, popExtraData } from "../../../../src/lib/utils/sessionUtils";

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

    describe("popExtraData", () => {
        it("should retrieve and delete extra data from session if it exists", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            setExtraData(session, key, value);
            expect(session.data.extra_data[key]).toEqual(value);

            // When
            const result = popExtraData(session, key);

            // Then
            expect(result).toEqual(value);
            expect(session.data.extra_data[key]).toBeUndefined();
        });

        it("should return undefined if session is not provided", () => {
            // Given
            const session = undefined;
            const key = "testKey";

            // When
            const result = popExtraData(session, key);

            // Then
            expect(result).toBeUndefined();
        });

        it("should return undefined if the key doesn't exist in extra data", () => {
            // Given
            const session: Session = new Session();
            const key = "nonExistentKey";

            // When
            const result = popExtraData(session, key);

            // Then
            expect(result).toBeUndefined();
        });

        it("should not affect other extra data when popping a specific key", () => {
            // Given
            const session: Session = new Session();
            setExtraData(session, "key1", "value1");
            setExtraData(session, "key2", "value2");

            // When
            const result = popExtraData(session, "key1");

            // Then
            expect(result).toEqual("value1");
            expect(session.data.extra_data.key1).toBeUndefined();
            expect(session.data.extra_data.key2).toEqual("value2");
        });
    });
});
