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
