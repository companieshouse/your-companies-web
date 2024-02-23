import { Request, Response } from "express";
import * as constants from "../../constants";
import { Session } from "@companieshouse/node-session-handler";
import { createCompanyAssociation } from "../../services/companyAssociationService";

export const createCompanyAssociationControllerGet = async (req: Request, res: Response) => {

    const session = req.session as Session;
    const submissionResponse = await createCompanyAssociation(session);

    if (submissionResponse.httpStatusCode === 201) {
        const nextPageUrl = constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL;
        return res.redirect(nextPageUrl);
    } else {
        // we will set up specific error handling depending on the response received from the associations api.
        throw new Error("unexpected response from create Accounts Association");
    }
};
