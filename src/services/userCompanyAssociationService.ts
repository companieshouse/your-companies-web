import { Associations, AssociationStatus } from "../types/associations";
import {
    COMPNANY_ASSOCIATED_WITH_USER,
    COMPNANY_NOT_ASSOCIATED_WITH_USER,
    CONFIRM,
    USER_REMOVED_FROM_COMPANY_ASSOCIATIONS,
    YES
} from "../constants";
import { Cancellation } from "../types/cancellation";
import { Removal } from "types/removal";
import { randomAssociations } from "../lib/createRandomAssociation";

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

export const getUserAssociations = async (userEmailAddress: string, status?: AssociationStatus): Promise<Associations> => {
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
                            invitedBy: "123454321",
                            invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
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
                            invitedBy: "123454321",
                            invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
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
                            invitedBy: "1122334455",
                            invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                        },
                        {
                            invitedBy: "75853993475",
                            invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
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
                            invitedBy: "5544332211",
                            invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
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
                            invitedBy: "76896789",
                            invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                        }
                    ]

            }
        ],
        totalResults: 5
    } as Associations;

    if (status) {
        associations.items = associations.items.filter(association => association.status === status);
    }

    if (status === AssociationStatus.CONFIRMED) {
        associations.items.push(...randomAssociations);
    }

    return Promise.resolve(userEmailAddress === "demo@ch.gov.uk" ? associations : { items: [], totalResults: 0 } as Associations);
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
export const getCompanyAssociations = async (companyNumber: string, cancellationOrRemoval: Cancellation | Removal | undefined): Promise<Associations> => {
    // We will replace this hard coded value with the API call once the API is available

    if (cancellationOrRemoval && "cancelPerson" in cancellationOrRemoval) {
        return getCompanyAssociationsAfterCancellation(companyNumber, cancellationOrRemoval);
    } else {
        return getCompanyAssociationsAfterRemoval(companyNumber, cancellationOrRemoval);
    }
};

const getCompanyAssociationsAfterCancellation = (companyNumber: string, cancellation: Cancellation | undefined): Promise<Associations> => {
    const associations: Associations = companyNumber === "NI038379" ? polishBrewItems : britishAirwaysItems;

    if (cancellation && cancellation.cancelPerson === YES) {
        associations.items = associations.items.filter(user => user.userEmail !== cancellation.userEmail);
    }
    return Promise.resolve(associations);
};
const getCompanyAssociationsAfterRemoval = (companyNumber: string, removal: Removal | undefined): Promise<Associations> => {
    const associations: Associations = companyNumber === "NI038379" ? polishBrewItems : britishAirwaysItems;

    if (removal && removal.removePerson === CONFIRM) {
        associations.items = associations.items.filter(user => user.userEmail !== removal.userEmail);
    }
    return Promise.resolve(associations);
};

export const removeUserFromCompanyAssociations = async (userEmail: string, companyNumber: string): Promise<string> => {
    // We will replace this hard coded value with the API call once the API is available
    return Promise.resolve(USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
};
