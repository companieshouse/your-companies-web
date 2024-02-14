import { postTransaction, createAccountsAssociation } from "../../../src/services/transactionService";
import { Session } from "@companieshouse/node-session-handler";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";

const session: Session = new Session();

const companyNumber = "123";
const description = "desc";
const reference = "ref";
const id = "123";

const expectedTransaction: Transaction = {
    companyNumber,
    reference,
    description,
    id
};

test("postTransaction should return a mock transaction", async () => {
    const data = await postTransaction(session, companyNumber, description, reference);
    expect(data).toEqual(expectedTransaction);
});

test("mock create Association should return a 201 status code", async () => {
    const expectedResponse = {
        httpStatusCode: 201
    };
    const data = await createAccountsAssociation(session, id);
    expect(data).toEqual(expectedResponse);
});
