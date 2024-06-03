import { Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData, getLoggedInUserEmail, setExtraData } from "../../lib/utils/sessionUtils";
import { Removal } from "../../types/removal";
import { getCompanyAssociations, removeUserFromCompanyAssociations } from "../../services/associationsService";
import { Associations } from "private-api-sdk-node/dist/services/associations/types";
import logger from "../../lib/Logger";
import { Session } from "@companieshouse/node-session-handler";
import { CompanyNameAndNumber } from "../../types/util-types";
import { validateRemoveAssociation } from "../../lib/validation/validateRemoveAssociation";

/**
 * This controller handles the removeUserFromCompanyAssociations (updateAssociationStatus) api call which
 * updates the status for the association.
 * If the user is removing themselves, it redirects them to the removing themselves success page, if removing
 * another user it redirects to the manage authorised person page with a success message.
 * If the request is invalid, the function throws an error
 */
export const removeAuthorisedPersonRequestController = async (req: Request, res: Response): Promise<void> => {

    const companyNumber: string = req.params[constants.COMPANY_NUMBER];
    const removal: Removal = getExtraData(req.session, constants.REMOVE_PERSON);

    const companyAssociations: Associations = await getCompanyAssociations(req, companyNumber);

    const associationToBeRemoved = companyAssociations.items.find(assoc => assoc.userEmail === removal.userEmail);

    if (!associationToBeRemoved || !validateRemoveAssociation(removal, companyNumber)) {
        throw new Error("validation for removal of assocation failed");
    }

    logger.info(`Request to remove association ${associationToBeRemoved.id}, ${associationToBeRemoved.companyNumber}`);

    await removeUserFromCompanyAssociations(req, associationToBeRemoved.id);

    if (isRemovingThemselves(req.session as Session, associationToBeRemoved.userEmail)) {
        logger.info(`Logged in user has removed themselves from ${associationToBeRemoved.companyNumber}`);

        setExtraData(req.session, constants.REMOVED_THEMSELVES_FROM_COMPANY, {
            companyName: associationToBeRemoved.companyName,
            companyNumber: associationToBeRemoved.companyNumber
        } as CompanyNameAndNumber);

        return res.redirect(constants.YOUR_COMPANIES_REMOVED_THEMSELVES_URL);
    } else {
        logger.info(`Association id ${associationToBeRemoved.id} status updated`);
        return res.redirect(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL.replace(`:${constants.COMPANY_NUMBER}`, removal.companyNumber));
    }
};

const isRemovingThemselves = (session: Session, removalEmail:string):boolean => removalEmail === getLoggedInUserEmail(session);
