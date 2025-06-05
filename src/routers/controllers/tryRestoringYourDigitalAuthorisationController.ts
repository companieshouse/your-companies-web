import { Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { getUserAssociations, updateAssociationStatus } from "../../services/associationsService";
import { CompanyNameAndNumber } from "../../types/utilTypes";
import { AssociationList, AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";
import logger, { createLogMessage } from "../../lib/Logger";

export const tryRestoringYourDigitalAuthorisationController = async (req: Request, res: Response): Promise<void> => {
    const confirmedCompanyForAssociation: CompanyNameAndNumber = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
    const userAssociations: AssociationList = await getUserAssociations(req, [AssociationStatus.MIGRATED], confirmedCompanyForAssociation.companyNumber);

    if (userAssociations.items.length === 0) {
        const errorMessage = `Missing association with status "${AssociationStatus.MIGRATED}" for company number: ${confirmedCompanyForAssociation.companyNumber}`;
        logger.error(
            createLogMessage(
                req.session,
                tryRestoringYourDigitalAuthorisationController.name,
                errorMessage
            ));
        throw new Error(errorMessage);
    }

    const associationId = userAssociations.items[0].id;
    await updateAssociationStatus(req, associationId, AssociationStatus.CONFIRMED);

    res.redirect(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL);
};
