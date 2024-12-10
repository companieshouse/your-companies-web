import { Request, Response } from "express";
import * as constants from "../../constants";
import { createAssociation } from "../../services/associationsService";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { getFullUrl } from "../../lib/utils/urlUtils";

export const createCompanyAssociationControllerGet = async (req: Request, res: Response): Promise<void> => {

    const confirmedCompanyForAssocation = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);

    await createAssociation(req, confirmedCompanyForAssocation.companyNumber);

    return res.redirect(getFullUrl(constants.COMPANY_ADDED_SUCCESS_URL));
};
