import { Request, Response } from "express";
import * as constants from "../../constants";
import { createAssociation } from "../../services/associationsService";
import { getExtraData } from "../../lib/utils/sessionUtils";

export const createCompanyAssociationControllerGet = async (req: Request, res: Response): Promise<void> => {

    const companyNumber = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
    const associationId = await createAssociation(req, companyNumber);

    if (associationId) {
        const nextPageUrl = constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL;
        return res.redirect(nextPageUrl);
    } else {
        // we will set up specific error handling depending on the response received from the associations api.
        throw new Error("unexpected response from create Accounts Association");
    }
};
