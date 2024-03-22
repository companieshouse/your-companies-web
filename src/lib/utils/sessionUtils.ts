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

export const setExtraData = (session: Session | undefined, key: string, data: any): void => {
    return session?.setExtraData(key, data);
};

export const getExtraData = (session: Session | undefined, key: string): any => {
    return session?.getExtraData(key);
};

export const deleteExtraData = (session: Session | undefined, key: string): any => {
    return session?.deleteExtraData(key);
};

export const getAccessToken = (session: Session | undefined): string => {
    return session?.data.signin_info?.access_token?.access_token as string;
};
