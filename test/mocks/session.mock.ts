import { Session } from "@companieshouse/node-session-handler";
import { AccessTokenKeys } from "@companieshouse/node-session-handler/lib/session/keys/AccessTokenKeys";
import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { UserProfileKeys } from "@companieshouse/node-session-handler/lib/session/keys/UserProfileKeys";
import { IAccessToken, ISignInInfo } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";

export const userMail = "userWithPermission@ch.gov.uk";
export const ACCESS_TOKEN_MOCK: IAccessToken = { [AccessTokenKeys.AccessToken]: "accessToken" };
export const REFRESH_TOKEN_MOCK: IAccessToken = { [AccessTokenKeys.RefreshToken]: "refreshToken" };

const SIGN_IN_INFO = {
    [SignInInfoKeys.SignedIn]: 1,
    [SignInInfoKeys.UserProfile]: { [UserProfileKeys.Email]: userMail },
    [SignInInfoKeys.AccessToken]: {
        ...ACCESS_TOKEN_MOCK,
        ...REFRESH_TOKEN_MOCK
    }
};

export function getSessionRequestWithPermission (): Session {
    return new Session({
        [SessionKey.SignInInfo]: SIGN_IN_INFO as ISignInInfo
    });
}

export const standardUserSessionMock = {
    data: {
        ".id": "32C6JZGd1A1zopsFWgQeIkKU8J0H",
        extra_data: {
            lang: "en"
        },
        csrf_token: "e2c3ef6d-34dc-44d3-bece-2acfdaaad228",
        expires: 1736361171,
        "authentication-service": {
        },
        ".zxs_key": "36f177ff148c612c5d4ed84c2886f46fc858d1d12e07d372fecdeeaca68eb646",
        ".hijacked": 0,
        ".client.signature": null,
        signin_info: {
            access_token: {
                access_token: "O0MAv4oAQdSaJ1EvSxiOD66TGtGffx1xIxYqsuE.EpumSisYPouACt7YrE67TDRyox2l9X4lCypSf4TeAdrkDQ==",
                refresh_token: "qU9a5s4lus6lTVrP6hDCg5ZEXMTciA0LE4VrAf184dS5mai8DOWfvGlXWPx1ah.N2u5kG0anCNjNAftmcV2xHg==",
                token_type: "Bearer",
                expires_in: 3600
            },
            signed_in: 1,
            csrf_token: "c1b54b46-0c18-49c5-83db-40116e8505b9",
            user_profile: {
                forename: null,
                surname: null,
                permissions: {
                },
                scope: "https://account.companieshouse.gov.uk/user.write-full",
                token_permissions: {
                    company_incorporation: "create",
                    user_presenter: "create",
                    user_orders: "create,read,update,delete",
                    acsp_associations: "read",
                    user_request_auth_code: "create",
                    user_secure_applications: "create,read,update,delete",
                    user_profile: "read,update,delete",
                    user_applications: "create,read,update,delete",
                    user_psc_verification: "create,read,update",
                    user_psc_discrepancy_report: "create,read,update",
                    user_following: "read,update",
                    user_third_party_apps: "read,delete",
                    user_transactions: "read,delete"
                },
                id: "Y2VkZWVlMzhlZWFjY2M4MzQ3MU",
                locale: "GB_en",
                email: "demo2@ch.gov.uk"
            }
        }
    }
} as unknown as Session;
