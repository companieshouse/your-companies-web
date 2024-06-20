import { Request, Response } from "express";
import * as constants from "../../constants";
import { createAssociation } from "../../services/associationsService";
import { getExtraData } from "../../lib/utils/sessionUtils";

export const createCompanyAssociationControllerGet = async (req: Request, res: Response): Promise<void> => {

    const confirmedCompanyForAssocation = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);

    await createAssociation(req, confirmedCompanyForAssocation.companyNumber);

    return res.redirect(constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL);
};
