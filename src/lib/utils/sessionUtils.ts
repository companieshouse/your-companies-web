import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { ISignInInfo } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { UserProfileKeys } from "@companieshouse/node-session-handler//lib/session/keys/UserProfileKeys";
import { Session } from "@companieshouse/node-session-handler";

const getSignInInfo = (session: Session | undefined): ISignInInfo | undefined => {
    return session?.data?.[SessionKey.SignInInfo];
};

export const getLoggedInUserEmail = (session: Session | undefined): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.UserProfile]?.[UserProfileKeys.Email] as string;
};

export const setExtraData = (session: Session | undefined, key: string, data: unknown): void => {
    return session?.setExtraData(key, data);
};

export const getExtraData = (session: Session | undefined, key: string): any => {
    return session?.getExtraData(key);
};

/**
 * This function will attempt to remove from extra data in a session the value that the provided key points at.
 * @param session is the session from which the extra data should be removed
 * @param key is the key to the value that should be removed
 * @returns true if the function attepts to remove extra data, false if session is not provided
 */
export const deleteExtraData = (session: Session | undefined, key: string): boolean => {
    return session ? session.deleteExtraData(key) : false;
};

export const getAccessToken = (session: Session | undefined): string => {
    return session?.data.signin_info?.access_token?.access_token as string;
};

export const popExtraData = (session: Session | undefined, key: string): any => {
    if (!session) return undefined;
    const data = session.getExtraData(key);
    session.deleteExtraData(key);
    return data;
};
