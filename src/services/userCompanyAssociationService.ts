import { Association, Associations } from "types/associations";
import { COMPNANY_ASSOCIATED_WITH_USER, COMPNANY_NOT_ASSOCIATED_WITH_USER } from "../constants";

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
                companyName: "ABC Ltd"
            },
            {
                id: "2345678901",
                userId: "qwertyiop",
                userEmail: "demo@ch.gov.uk",
                companyNumber: "AB123456",
                companyName: "XYZ Ltd"
            }
        ]
    } as Associations;
    return Promise.resolve(userEmailAddress === "demo@ch.gov.uk" ? associations : { items: [] } as Associations);
};

export const getCompanyAssociations = async (companyNumber: string): Promise<Associations> => {
    // TODO - replace this hard coded value with the API call once the API is available
    const associations: Associations = {
        items: [
            {
                id: "1234567890",
                userId: "qwertyiop",
                userEmail: "demo@ch.gov.uk",
                companyNumber: "NI038379",
                companyName: "ABC Ltd",
                status: "Awaiting confirmation"
            },
            {
                id: "2345678901",
                userId: "jsldkfjsd",
                userEmail: "john.smith@test.com",
                displayName: "Not provided",
                companyNumber: "NI038379",
                companyName: "ABC Ltd",
                status: "Confirmed"
            },
            {
                id: "2345678901",
                userId: "jsldkfjsd",
                userEmail: "eva.brown@company.com",
                companyNumber: "NI038379",
                companyName: "ABC Ltd",
                status: "Awaiting confirmation"
            },
            {
                id: "2345678901",
                userId: "jsldkfjsd",
                userEmail: "mark.black@private.com",
                displayName: "Mark Black",
                companyNumber: "NI038379",
                companyName: "ABC Ltd",
                status: "Confirmed"
            }
        ]
    } as Associations;
    return Promise.resolve(associations);
};
