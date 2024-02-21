import { createCompanyAssociation } from "../../../src/services/companyAssociationService";
import { Session } from "@companieshouse/node-session-handler";

const session: Session = new Session();

test("mock create Association should return a 201 status code", async () => {
    const expectedResponse = {
        httpStatusCode: 201
    };
    const data = await createCompanyAssociation(session);
    expect(data).toEqual(expectedResponse);
});
