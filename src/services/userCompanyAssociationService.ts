/* eslint-disable @typescript-eslint/camelcase */

import { Associations } from "../types/associations";
import {
    COMPNANY_ASSOCIATED_WITH_USER,
    COMPNANY_NOT_ASSOCIATED_WITH_USER,
    USER_REMOVED_FROM_COMPANY_ASSOCIATIONS,
    YES
} from "../constants";
import { Cancellation } from "../types/cancellation";

/**
 * Check if there is an association between the user and the company.
 *
 * @param companyNumber the company number for which to check the association
 * @param userEmailAddress the user email address for which to check the association
 */
export const isCompanyAssociatedWithUser = async (companyNumber: string, userEmailAddress: string): Promise<string> => {
    // We will replace this hard coded value with the API call once the API is available
    return Promise.resolve(companyNumber === "NI038379" ? COMPNANY_ASSOCIATED_WITH_USER : COMPNANY_NOT_ASSOCIATED_WITH_USER);
};

export const getUserAssociations = async (userEmailAddress: string): Promise<Associations> => {
    // We will replace this hard coded value with the API call once the API is available
    const associations: Associations = {
        items: [
            {
                id: "1234567890",
                userId: "qwertyiop",
                userEmail: "demo@ch.gov.uk",
                companyNumber: "NI038379",
                companyName: "THE POLISH BREWERY",
                status: "confirmed",
                invitations:
                [
                    {
                        invited_by: "123454321",
                        invited_at: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]
            },
            {
                id: "2345678901",
                userId: "qwertyiop",
                userEmail: "demo@ch.gov.uk",
                companyNumber: "01777777",
                companyName: "BRITISH AIRWAYS PLC",
                status: "confirmed",
                invitations:
                [
                    {
                        invited_by: "123454321",
                        invited_at: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]
            },
            {
                id: "44345677554",
                userId: "qwertyiop",
                userEmail: "demo@ch.gov.uk",
                companyNumber: "10866549",
                companyName: "ANDROID TECHNOLOGY LTD",
                status: "awaiting-approval",
                invitations:
                [
                    {
                        invited_by: "1122334455",
                        invited_at: "2022-04-05T11:41:09.568+00:00 UTC"
                    },
                    {
                        invited_by: "75853993475",
                        invited_at: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]
            },
            {
                id: "234322344",
                userId: "qwertyiop",
                userEmail: "demo@ch.gov.uk",
                companyNumber: "08449801",
                companyName: "BROWN AND SALTER LIMITED",
                status: "awaiting-approval",
                invitations:
                [
                    {
                        invited_by: "5544332211",
                        invited_at: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

            },
            {
                id: "6654463562412",
                userId: "qwertyiop",
                userEmail: "demo@ch.gov.uk",
                companyNumber: "18882777",
                companyName: "FLOWERS LIMITED",
                status: "awaiting-approval",
                invitations:
                [
                    {
                        invited_by: "76896789",
                        invited_at: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

            }
        ]
    } as Associations;
    return Promise.resolve(userEmailAddress === "demo@ch.gov.uk" ? associations : { items: [] } as Associations);
};

export const polishBrewItems = {
    items: [
        {
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "Awaiting confirmation"
        },
        {
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "john.smith@test.com",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "Confirmed"
        },
        {
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "eva.brown@company.com",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "Awaiting confirmation"
        },
        {
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "mark.black@private.com",
            displayName: "Mark Black",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "Confirmed"
        }
    ]
} as Associations;

export const britishAirwaysItems = {
    items: [
        {
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "john.smith@test.com",
            displayName: "John Smith",
            companyNumber: "01777777",
            companyName: "BRITISH AIRWAYS PLC",
            status: "Confirmed"
        }
    ]
} as Associations;

export const getCompanyAssociations = async (companyNumber: string, cancellation: Cancellation | undefined): Promise<Associations> => {
    // We will replace this hard coded value with the API call once the API is available
    const associations: Associations = companyNumber === "NI038379" ? polishBrewItems : britishAirwaysItems;

    if (cancellation && cancellation.cancelPerson === YES) {
        associations.items = associations.items.filter(user => user.userEmail !== cancellation.userEmail);
    }
    return Promise.resolve(associations);
};

export const isEmailAuthorised = async (email: string, companyNumber: string): Promise<boolean> => {
    const companyAssociations: Associations = await getCompanyAssociations(companyNumber, undefined);
    return companyAssociations.items.some(item => item.userEmail.toLowerCase() === email.toLowerCase());
};
export const addUserEmailAssociation = async (email: string, companyNumber: string): Promise<void> => {
    if (!email) return;
    if (companyNumber === "NI038379") {
        const isAssociated = await isEmailAuthorised(email, companyNumber);
        if (!isAssociated) {
            polishBrewItems.items.push(
                {
                    id: "",
                    userId: "",
                    userEmail: email,
                    companyNumber: "NI038379",
                    companyName: "THE POLISH BREWERY",
                    status: "Awaiting confirmation",
                    displayName: ""
                }
            );
        }
    }
    if (companyNumber === "01777777") {
        const isAssociated = await isEmailAuthorised(email, companyNumber);
        if (!isAssociated) {
            britishAirwaysItems.items.push(
                {
                    id: "",
                    userId: "",
                    userEmail: email,
                    displayName: "",
                    companyNumber: "01777777",
                    companyName: "BRITISH AIRWAYS PLC",
                    status: "Awaiting confirmation"
                }
            );
        }
    }
};

export const removeUserFromCompanyAssociations = async (userEmail: string, companyNumber: string): Promise<string> => {
    // We will replace this hard coded value with the API call once the API is available
    return Promise.resolve(USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
};
