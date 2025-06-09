import { Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { createAssociation } from "../../services/associationsService";
import { CompanyNameAndNumber } from "../../types/utilTypes";
import logger, { createLogMessage } from "../../lib/Logger";
import { getFullUrl } from "../../lib/utils/urlUtils";

export const tryRestoringYourDigitalAuthorisationControllerGet = async (req: Request, res: Response): Promise<void> => {
    const confirmedCompanyForAssociation: CompanyNameAndNumber = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
    logger.info(
        createLogMessage(
            req.session,
            tryRestoringYourDigitalAuthorisationControllerGet.name,
            `Calling API to restore digital authorisation for association with company ID: ${confirmedCompanyForAssociation.companyNumber}`
        ));
    await createAssociation(req, confirmedCompanyForAssociation.companyNumber);

    res.redirect(getFullUrl(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL));
};
