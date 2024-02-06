import { Request, Response, NextFunction } from "express";
import * as constants from "../../constants";
import logger from "../../lib/Logger";
import { Session } from "@companieshouse/node-session-handler";
import * as urlUtils from "../../lib/utils/urlUtils";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { createAccountsAssociation, postTransaction } from "../../services/transactionService";

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const DESCRIPTION = "Accounts Association Transaction";
        const REFERENCE = "AccountsAssociationReference";
        const session = req.session as Session;
        const companyNumber = req.params.companyNumber;

        const transaction: Transaction = await postTransaction(session, companyNumber, DESCRIPTION, REFERENCE);
        const transactionId = transaction.id as string;

        const submissionResponse = await createAccountsAssociation(session, transactionId);

        if (submissionResponse.httpStatusCode === 201) {
            const nextPageUrl = urlUtils.getUrlWithCompanyNumber(constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL, companyNumber);
            return res.redirect(nextPageUrl);
        } else {
            throw new Error("unexpected response from create Accounts Association");
        }
    } catch (e) {
        return next(e);
    }
};
