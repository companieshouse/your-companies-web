import { Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData, getLoggedInUserEmail, setExtraData } from "../../lib/utils/sessionUtils";
import { Removal } from "../../types/removal";
import { getCompanyAssociations, removeUserFromCompanyAssociations } from "../../services/associationsService";
import { Associations, Association } from "private-api-sdk-node/dist/services/associations/types";
import logger from "../../lib/Logger";
import { Session } from "@companieshouse/node-session-handler";
import { CompanyNameAndNumber } from "../../types/util-types";

const validateRemoveAssociation = (foundAssociation:Association|undefined, removal:Removal, companyNumber:string) => {
    if (!foundAssociation) {
        logger.info(`removal request invalid: association not found for this removal request`);
        return false;
    }
    if (removal?.removePerson !== constants.CONFIRM) {
        logger.info(`removal request invalid: removePerson status not confirmed`);
        return false;
    }
    if (removal.companyNumber !== companyNumber) {
        logger.info(`removal request invalid: company number url param did not match the company number in removal`);
        return false;
    }
    return true;
};

const isRemovingThemselves = (session: Session, removalEmail:string) => {
    return removalEmail === getLoggedInUserEmail(session);
};

export const removeAuthorisedPersonRequestController = async (req: Request, res: Response): Promise<void> => {

    const companyNumber: string = req.params[constants.COMPANY_NUMBER];
    const removal: Removal = getExtraData(req.session, constants.REMOVE_PERSON);

    const companyAssociations: Associations = await getCompanyAssociations(req, companyNumber);

    const associationToBeRemoved = companyAssociations.items.find(
        assoc => assoc.userEmail === removal.userEmail
    );

    if (!associationToBeRemoved || !validateRemoveAssociation(associationToBeRemoved, removal, companyNumber)) {
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
        return res.redirect(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber));
    }
};
