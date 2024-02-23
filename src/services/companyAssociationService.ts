import { Session } from "@companieshouse/node-session-handler";

export const createCompanyAssociation = async (session: Session) => {
    return Promise.resolve({
        httpStatusCode: 201
    });
};
