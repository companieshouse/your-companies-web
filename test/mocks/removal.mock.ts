import * as constants from "../../src/constants";
import { Removal } from "../../src/types/removal";
import { companyAssociations } from "../mocks/associations.mock";

export const removalWithoutUserName: Removal = {
    removePerson: constants.CONFIRM,
    userEmail: companyAssociations.items[1].userEmail,
    companyNumber: companyAssociations.items[1].companyNumber
};

export const removalWithUserName: Removal = {
    removePerson: constants.CONFIRM,
    userEmail: companyAssociations.items[3].userEmail,
    userName: companyAssociations.items[3].displayName,
    companyNumber: companyAssociations.items[3].companyNumber
};
