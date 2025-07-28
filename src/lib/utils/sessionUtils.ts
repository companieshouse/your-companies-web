import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { ISignInInfo } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { UserProfileKeys } from "@companieshouse/node-session-handler/lib/session/keys/UserProfileKeys";
import { Session } from "@companieshouse/node-session-handler";
import { AccessTokenKeys } from "@companieshouse/node-session-handler/lib/session/keys/AccessTokenKeys";
import logger from "../../lib/Logger";
import * as constants from "../../constants";
/**
 * Retrieves the sign-in information from the session.
 * @param session The session object, or undefined if no session exists.
 * @returns The sign-in information, or undefined if not available.
 */
const getSignInInfo = (session: Session | undefined): ISignInInfo | undefined => {
    return session?.data?.[SessionKey.SignInInfo];
};

/**
 * Retrieves the logged-in user's email address from the session.
 * @param session The session object, or undefined if no session exists.
 * @returns The email address of the logged-in user as a string.
 */
export const getLoggedInUserEmail = (session: Session | undefined): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.UserProfile]?.[UserProfileKeys.Email] as string;
};

/**
 * Retrieves the logged-in user's id from the session.
 * @param session  The session object, or undefined if no session exists.
 * @returns The user id as a string.
 */
export const getLoggedInUserId = (session: Session | undefined): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.UserProfile]?.[UserProfileKeys.UserId] as string;
};

/**
 * Stores additional data in the session under a specified key.
 * @param session The session object, or undefined if no session exists.
 * @param key The key under which the data should be stored.
 * @param data The data to store in the session.
 */
export const setExtraData = (session: Session | undefined, key: string, data: unknown): void => {
    if (session) {
        session.setExtraData(key, data);
    }
};

/**
 * Retrieves additional data from the session using a specified key.
 * @param session The session object, or undefined if no session exists.
 * @param key The key of the data to retrieve.
 * @returns The data associated with the key, or undefined if not found.
 */
export const getExtraData = (session: Session | undefined, key: string): any => {
    return session?.getExtraData(key);
};

/**
 * Removes additional data from the session using a specified key.
 * @param session The session object, or undefined if no session exists.
 * @param key The key of the data to remove.
 * @returns True if the data was removed, false if the session is undefined.
 */
export const deleteExtraData = (session: Session | undefined, key: string): boolean => {
    return session ? session.deleteExtraData(key) : false;
};

/**
 * Retrieves the access token from the session.
 * @param session The session object, or undefined if no session exists.
 * @returns The access token as a string.
 */
export const getAccessToken = (session: Session | undefined): string => {
    return session?.data?.signin_info?.access_token?.access_token as string;
};

/**
 * Retrieves the refreshed token from the session.
 * @param session The session object, or undefined if no session exists.
 * @returns The refreshed token as a string.
 */
export const getRefreshToken = (session: Session): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.AccessToken]?.[AccessTokenKeys.RefreshToken] as string;
};

/**
 * Sets the access token in the session.
 * @param session The session object.
 * @param accessToken The access token to store in the session.
 * @throws Error if SignInInfo is not present in the session.
 */
export const setAccessToken = (session: Session, accessToken: string): void => {
    const signInInfo = getSignInInfo(session);
    if (signInInfo) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        signInInfo[SignInInfoKeys.AccessToken]![AccessTokenKeys.AccessToken] = accessToken;
    } else {
        const errorMessage = "SignInInfo not present in the session";
        logger.error(`${setAccessToken.name}: ${errorMessage}`);
        throw new Error(errorMessage);
    }
};

export const setCompanyNameInCollection = (session: Session, companyName: string, companyNumber:string): void => {
    const companyNameCollection = getExtraData(session, constants.COMPANY_NAME_COLLECTION) || {};
    companyNameCollection[companyNumber] = companyName;
    setExtraData(session, constants.COMPANY_NAME_COLLECTION, companyNameCollection);
};

export const getCompanyNameFromCollection = (session: Session, companyNumber: string): string | undefined => {
    const companyNameCollection = getExtraData(session, constants.COMPANY_NAME_COLLECTION);
    return companyNameCollection?.[companyNumber];
};

export const setSearchStringEmail = (session: Session, email: string, companyNumber:string): void => {
    const emailSearchCollection = getExtraData(session, constants.SEARCH_STRING_EMAIL) || {};

    emailSearchCollection[companyNumber] = email;
    setExtraData(session, constants.SEARCH_STRING_EMAIL, emailSearchCollection);
};

export const getSearchStringEmail = (session: Session, companyNumber: string): string | undefined => {
    const emailSearchCollection = getExtraData(session, constants.SEARCH_STRING_EMAIL);
    return emailSearchCollection?.[companyNumber];
};

export const deleteSearchStringEmail = (session: Session, companyNumber:string): void => {
    const emailSearchCollection = getExtraData(session, constants.SEARCH_STRING_EMAIL);
    if (!emailSearchCollection) {
        return;
    }
    delete emailSearchCollection[companyNumber];
    setExtraData(session, constants.SEARCH_STRING_EMAIL, emailSearchCollection);
};
