import { Session } from "@companieshouse/node-session-handler";
import {
    getSessionRequestWithPermission,
    standardUserSessionMock,
    userMail
} from "../../../../mocks/session.mock";
import {
    addToAssociationIdArr,
    deleteExtraData,
    getAccessToken,
    getExtraData,
    getLoggedInUserEmail,
    getRefreshToken,
    setAccessToken,
    setExtraData,
    setCompanyNameInCollection,
    getCompanyNameFromCollection,
    setSearchStringEmail,
    getSearchStringEmail,
    deleteSearchStringEmail
} from "../../../../../src/lib/utils/sessionUtils";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";

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
    describe("getCompanyNameFromCollection", () => {
        it("should get company name from collection", () => {
            // Given
            const session: Session = new Session();
            const companyNumber = "AB123456";
            jest
                .spyOn(sessionUtils, "getExtraData")
                .mockReturnValueOnce({ AB123456: "Mocked Company Name" });
            // When
            const companyName = getCompanyNameFromCollection(session, companyNumber);
            // Then
            expect(companyName).toEqual("Mocked Company Name");
        });

        it("should return undefined if company number not in collection", () => {
            // Given
            const session: Session = new Session();
            const companyNumber = "NOT_FOUND";
            jest
                .spyOn(sessionUtils, "getExtraData")
                .mockReturnValueOnce({ AB123456: "Mocked Company Name" });
            // When
            const companyName = getCompanyNameFromCollection(session, companyNumber);
            // Then
            expect(companyName).toBeUndefined();
        });

        it("should return undefined if collection is undefined", () => {
            // Given
            const session: Session = new Session();
            const companyNumber = "ANY";
            jest
                .spyOn(sessionUtils, "getExtraData")
                .mockReturnValueOnce(undefined);
            // When
            const companyName = getCompanyNameFromCollection(session, companyNumber);
            // Then
            expect(companyName).toBeUndefined();
        });
    });

    describe("setCompanyNameInCollection", () => {
        it("should set company name in collection", () => {
            // Given
            const session: Session = new Session();
            const companyNumber = "YZ98765";

            const setExtraDataMock = jest
                .spyOn(sessionUtils, "setExtraData");

            // When
            setCompanyNameInCollection(session, "Mocked Company Name", companyNumber);
            // Then
            expect(setExtraDataMock).toHaveBeenCalledWith(
                session,
                "companyNameCollection",
                { [companyNumber]: "Mocked Company Name" }
            );
            setExtraDataMock.mockRestore();
        });

        it("should add company name to existing collection", () => {
            // Given
            const session: Session = new Session();
            const companyNumber = "NEW123";
            const existingCollection = { OLD456: "Old Company" };
            jest
                .spyOn(sessionUtils, "getExtraData")
                .mockReturnValueOnce(existingCollection);

            const setExtraDataMock = jest
                .spyOn(sessionUtils, "setExtraData");
            // When
            setCompanyNameInCollection(session, "New Company", companyNumber);
            // Then
            expect(setExtraDataMock).toHaveBeenCalledWith(
                session,
                "companyNameCollection",
                { ...existingCollection, [companyNumber]: "New Company" }
            );
            setExtraDataMock.mockRestore();
        });

        it("should create new collection if none exists", () => {
            // Given
            const session: Session = new Session();
            const companyNumber = "FIRST1";
            jest
                .spyOn(sessionUtils, "getExtraData")
                .mockReturnValueOnce(undefined);

            const setExtraDataMock = jest
                .spyOn(sessionUtils, "setExtraData");
            // When
            setCompanyNameInCollection(session, "First Company", companyNumber);
            // Then
            expect(setExtraDataMock).toHaveBeenCalledWith(
                session,
                "companyNameCollection",
                { [companyNumber]: "First Company" }
            );
            setExtraDataMock.mockRestore();
        });
    });

    describe("setSearchStringEmail", () => {
        it("should set email for a company number in collection when collection exists", () => {
            // Given
            const session: Session = new Session();
            const existingCollection = { OLD1: "old@example.com" };
            jest
                .spyOn(sessionUtils, "getExtraData")
                .mockReturnValueOnce(existingCollection);
            const setExtraDataMock = jest.spyOn(sessionUtils, "setExtraData");
            const companyNumber = "NEW123";
            const email = "bob@bob.com";
            // When
            setSearchStringEmail(session, email, companyNumber);
            // Then
            expect(setExtraDataMock).toHaveBeenCalledWith(
                session,
                "searchStringEmail",
                { ...existingCollection, [companyNumber]: email }
            );
            setExtraDataMock.mockRestore();
        });

        it("should create new collection if none exists", () => {
            // Given
            const session: Session = new Session();
            jest.spyOn(sessionUtils, "getExtraData").mockReturnValueOnce(undefined);
            const setExtraDataMock = jest.spyOn(sessionUtils, "setExtraData");
            const companyNumber = "NEW123";
            const email = "bob@bob.com";
            // When
            setSearchStringEmail(session, email, companyNumber);
            // Then
            expect(setExtraDataMock).toHaveBeenCalledWith(
                session,
                "searchStringEmail",
                { [companyNumber]: email }
            );
            setExtraDataMock.mockRestore();
        });
    });

    describe("getSearchStringEmail", () => {
        it("should return email for company number if present", () => {
            // Given
            const session: Session = new Session();
            const companyNumber = "NEW123";
            const email = "bob@bob.com";
            const collection = { [companyNumber]: email };
            jest.spyOn(sessionUtils, "getExtraData").mockReturnValueOnce(collection);
            // When
            const result = getSearchStringEmail(session, companyNumber);
            // Then
            expect(result).toEqual(email);
        });

        it("should return undefined if company number not present", () => {
            // Given
            const session: Session = new Session();
            const collection = { OTHER: "other@example.com" };
            const companyNumber = "NEW123";
            jest.spyOn(sessionUtils, "getExtraData").mockReturnValueOnce(collection);
            // When
            const result = getSearchStringEmail(session, companyNumber);
            // Then
            expect(result).toBeUndefined();
        });

        it("should return undefined if collection is undefined", () => {
            // Given
            const session: Session = new Session();
            jest.spyOn(sessionUtils, "getExtraData").mockReturnValueOnce(undefined);
            const companyNumber = "NEW123";
            // When
            const result = getSearchStringEmail(session, companyNumber);
            // Then
            expect(result).toBeUndefined();
        });
    });

    describe("deleteSearchStringEmail", () => {
        const companyNumber = "ABC123";
        const email = "rob@example.com";

        it("should delete email for company number if present", () => {
            const session: Session = new Session();
            const collection = { [companyNumber]: email, OTHER: "other@example.com" };
            jest.spyOn(sessionUtils, "getExtraData").mockReturnValueOnce(collection);
            const setExtraDataMock = jest.spyOn(sessionUtils, "setExtraData");
            deleteSearchStringEmail(session, companyNumber);
            const expected = { OTHER: "other@example.com" };
            expect(setExtraDataMock).toHaveBeenCalledWith(
                session,
                "searchStringEmail",
                expected
            );
            setExtraDataMock.mockRestore();
        });

        it("should do nothing if collection is undefined", () => {
            const session: Session = new Session();
            jest.spyOn(sessionUtils, "getExtraData").mockReturnValueOnce(undefined);
            const setExtraDataMock = jest.spyOn(sessionUtils, "setExtraData");
            deleteSearchStringEmail(session, companyNumber);
            expect(setExtraDataMock).not.toHaveBeenCalled();
            setExtraDataMock.mockRestore();
        });

        it("should delete collection if deleteEntireCollection is true", () => {
            const session: Session = new Session();
            const deleteExtraDataMock = jest.spyOn(sessionUtils, "deleteExtraData");
            deleteSearchStringEmail(session, companyNumber, true);
            expect(deleteExtraDataMock).toHaveBeenCalledWith(
                session,
                "searchStringEmail"
            );
            deleteExtraDataMock.mockRestore();
        });

        it("should do nothing if session is undefined", () => {
            const setExtraDataMock = jest.spyOn(sessionUtils, "setExtraData");
            const deleteExtraDataMock = jest.spyOn(sessionUtils, "deleteExtraData");
            // @ts-expect-error purposely passing undefined
            deleteSearchStringEmail(undefined, companyNumber);
            expect(setExtraDataMock).not.toHaveBeenCalled();
            expect(deleteExtraDataMock).not.toHaveBeenCalled();
            setExtraDataMock.mockRestore();
            deleteExtraDataMock.mockRestore();
        });

        it("should do nothing if companyNumber is not provided and deleteEntireCollection is false", () => {
            const session: Session = new Session();
            const setExtraDataMock = jest.spyOn(sessionUtils, "setExtraData");
            const deleteExtraDataMock = jest.spyOn(sessionUtils, "deleteExtraData");

            deleteSearchStringEmail(session);
            expect(setExtraDataMock).not.toHaveBeenCalled();
            expect(deleteExtraDataMock).not.toHaveBeenCalled();

            setExtraDataMock.mockRestore();
        });

        it("should do nothing if emailSearchCollection is not an object", () => {
            const session: Session = new Session();
            jest.spyOn(sessionUtils, "getExtraData").mockReturnValueOnce("not-an-object");
            const setExtraDataMock = jest.spyOn(sessionUtils, "setExtraData");
            const deleteExtraDataMock = jest.spyOn(sessionUtils, "deleteExtraData");

            deleteSearchStringEmail(session, companyNumber);
            expect(setExtraDataMock).not.toHaveBeenCalled();
            expect(deleteExtraDataMock).not.toHaveBeenCalled();

            setExtraDataMock.mockRestore();
        });

        it("should do nothing if companyNumber is not in collection", () => {
            const session: Session = new Session();
            const collection = { OTHER: "other@example.com" };
            jest.spyOn(sessionUtils, "getExtraData").mockReturnValueOnce(collection);
            const setExtraDataMock = jest.spyOn(sessionUtils, "setExtraData");
            deleteSearchStringEmail(session, companyNumber);
            expect(setExtraDataMock).not.toHaveBeenCalled();
            setExtraDataMock.mockRestore();
        });
    });

    describe("addToAssociationIdArr", () => {
        it("should add to the existing array if one exists in session", () => {
            // Given
            const session: Session = new Session();
            const existingAssociatioIds = ["abc123"];
            jest
                .spyOn(sessionUtils, "getExtraData")
                .mockReturnValueOnce(existingAssociatioIds);
            const setExtraDataMock = jest.spyOn(sessionUtils, "setExtraData");
            const idToAdd = "xyz123";
            // When
            addToAssociationIdArr(session, idToAdd);
            // Then
            expect(setExtraDataMock).toHaveBeenCalledWith(
                session,
                "navigationMiddlewareCheckAssociationId",
                ["abc123", "xyz123"]
            );
            setExtraDataMock.mockRestore();
        });

        it("should create new array if none exists", () => {
            // Given
            const session: Session = new Session();
            jest.spyOn(sessionUtils, "getExtraData").mockReturnValueOnce(undefined);
            const setExtraDataMock = jest.spyOn(sessionUtils, "setExtraData");
            const idToAdd = "xyz123";

            // When
            addToAssociationIdArr(session, idToAdd);
            // Then
            expect(setExtraDataMock).toHaveBeenCalledWith(
                session,
                "navigationMiddlewareCheckAssociationId",
                ["xyz123"]
            );
            setExtraDataMock.mockRestore();
        });
    });
});
