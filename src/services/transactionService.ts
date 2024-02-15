import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { Session } from "@companieshouse/node-session-handler";

export const createAccountsAssociation = async (session: Session, transactionId:string) => {
    return Promise.resolve({
        httpStatusCode: 201
    });
};

export const postTransaction = async (session: Session, companyNumber: string, description: string, reference: string): Promise<Transaction> => {
    const transaction: Transaction = {
        companyNumber,
        reference,
        description,
        id: "123"
    };
    return Promise.resolve(transaction);
};
