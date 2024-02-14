import { Associations } from "types/associations";
import {
    COMPNANY_ASSOCIATED_WITH_USER,
    COMPNANY_NOT_ASSOCIATED_WITH_USER,
    USER_NOT_REMOVED_FROM_COMPANY_ASSOCIATIONS,
    USER_REMOVED_FROM_COMPANY_ASSOCIATIONS
} from "../constants";

/**
 * Check if there is an association between the user and the company.
 *
 * @param companyNumber the company number for which to check the association
 * @param userEmailAddress the user email address for which to check the association
 */
export const isCompanyAssociatedWithUser = async (companyNumber: string, userEmailAddress: string): Promise<string> => {
    // TODO - replace this hard coded value with the API call once the API is available
    return Promise.resolve(companyNumber === "NI038379" ? COMPNANY_ASSOCIATED_WITH_USER : COMPNANY_NOT_ASSOCIATED_WITH_USER);
};

export const getUserAssociations = async (userEmailAddress: string): Promise<Associations> => {
    // TODO - replace this hard coded value with the API call once the API is available
    const associations: Associations = {
        items: [
            {
                id: "1234567890",
                userId: "qwertyiop",
                userEmail: "demo@ch.gov.uk",
                companyNumber: "NI038379",
                companyName: "THE POLISH BREWERY"
            },
            {
                id: "2345678901",
                userId: "qwertyiop",
                userEmail: "demo@ch.gov.uk",
                companyNumber: "01777777",
                companyName: "BRITISH AIRWAYS PLC"
            }
        ]
    } as Associations;
    return Promise.resolve(userEmailAddress === "demo@ch.gov.uk" ? associations : { items: [] } as Associations);
};

export const getCompanyAssociations = async (companyNumber: string): Promise<Associations> => {
    // TODO - replace this hard coded value with the API call once the API is available
    const associations: Associations = companyNumber === "NI038379" ? {
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
    } as Associations : {
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
    return Promise.resolve(associations);
};

export const removeUserFromCompanyAssociations = async (userEmail: string, companyNumber: string): Promise<string> => {
    // TODO - replace this hard coded value with the API call once the API is available
    return Promise.resolve(userEmail === "eva.brown@company.com" ? USER_REMOVED_FROM_COMPANY_ASSOCIATIONS : USER_NOT_REMOVED_FROM_COMPANY_ASSOCIATIONS);
};
