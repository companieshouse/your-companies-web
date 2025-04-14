import { Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { isRemovingThemselves } from "../../lib/utils/removeThemselves";
import { Removal } from "../../types/removal";
import { getCompanyAssociations, removeUserFromCompanyAssociations } from "../../services/associationsService";
import { AssociationList, Association } from "private-api-sdk-node/dist/services/associations/types";
import logger from "../../lib/Logger";
import { Session } from "@companieshouse/node-session-handler";
import { CompanyNameAndNumber } from "../../types/utilTypes";
import { validateRemoveAssociation } from "../../lib/validation/validateRemoveAssociation";
import { getFullUrl } from "../../lib/utils/urlUtils";

/**
 * Handles the removal of an authorised person from a company association.
 * Validates the removal request, performs the removal, and redirects the user
 * to the appropriate page based on whether they are removing themselves or another user.
 *
 * @param req - The HTTP request object
 * @param res - The HTTP response object
 * @throws Error if the removal request is invalid
 */
export const removeAuthorisedPersonRequestController = async (req: Request, res: Response): Promise<void> => {
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const removal = getExtraData(req.session, constants.REMOVE_PERSON) as Removal;

    const companyAssociations = await fetchCompanyAssociations(req, companyNumber);
    const associationToBeRemoved = findAssociationToBeRemoved(companyAssociations, removal.userEmail);

    validateRemovalRequest(associationToBeRemoved, removal, companyNumber);

    if (associationToBeRemoved) {
        await performAssociationRemoval(req, associationToBeRemoved);
    } else {
        throw new Error("Association to be removed is undefined");
    }

    if (associationToBeRemoved && isRemovingThemselves(req.session as Session, associationToBeRemoved.userEmail)) {
        handleSelfRemoval(req, res, associationToBeRemoved);
    } else {
        if (associationToBeRemoved) {
            handleOtherUserRemoval(res, removal.companyNumber, associationToBeRemoved.id);
        }
    }
};

/**
 * Fetches the list of company associations for a given company number.
 *
 * @param req - The HTTP request object
 * @param companyNumber - The company number
 * @returns The list of company associations
 */
const fetchCompanyAssociations = async (req: Request, companyNumber: string): Promise<AssociationList> => {
    return await getCompanyAssociations(req, companyNumber, undefined, undefined, undefined, 100000);
};

/**
 * Finds the association to be removed based on the user's email.
 *
 * @param companyAssociations - The list of company associations
 * @param userEmail - The email of the user to be removed
 * @returns The association to be removed
 */
const findAssociationToBeRemoved = (companyAssociations: AssociationList, userEmail: string): Association | undefined => {
    return companyAssociations.items.find(assoc => assoc.userEmail === userEmail);
};

/**
 * Validates the removal request.
 *
 * @param associationToBeRemoved - The association to be removed
 * @param removal - The removal details
 * @param companyNumber - The company number
 */
const validateRemovalRequest = (associationToBeRemoved: Association | undefined, removal: Removal, companyNumber: string): void => {
    if (!associationToBeRemoved || !validateRemoveAssociation(removal, companyNumber)) {
        throw new Error("validation for removal of association failed");
    }
};

/**
 * Performs the removal of the association.
 *
 * @param req - The HTTP request object
 * @param associationToBeRemoved - The association to be removed
 */
const performAssociationRemoval = async (req: Request, associationToBeRemoved: Association): Promise<void> => {
    logger.info(`Request to remove association ${associationToBeRemoved.id}, ${associationToBeRemoved.companyNumber}`);
    await removeUserFromCompanyAssociations(req, associationToBeRemoved.id);
};

/**
 * Handles the scenario where the logged-in user removes themselves from a company association.
 *
 * @param req - The HTTP request object
 * @param res - The HTTP response object
 * @param associationToBeRemoved - The association to be removed
 */
const handleSelfRemoval = (req: Request, res: Response, associationToBeRemoved: Association): void => {
    logger.info(`Logged in user has removed themselves from ${associationToBeRemoved.companyNumber}`);
    setExtraData(req.session, constants.REMOVED_THEMSELVES_FROM_COMPANY, {
        companyName: associationToBeRemoved.companyName,
        companyNumber: associationToBeRemoved.companyNumber
    } as CompanyNameAndNumber);
    res.redirect(getFullUrl(constants.REMOVED_THEMSELVES_URL));
};

/**
 * Handles the scenario where the logged-in user removes another user from a company association.
 *
 * @param res - The HTTP response object
 * @param companyNumber - The company number
 * @param associationId - The ID of the removed association
 */
const handleOtherUserRemoval = (res: Response, companyNumber: string, associationId: string): void => {
    logger.info(`Association id ${associationId} status updated`);
    res.redirect(getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL).replace(`:${constants.COMPANY_NUMBER}`, companyNumber));
};
