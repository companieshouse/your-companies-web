import * as constants from "../../constants";

export const getUrlWithCompanyNumber = (url: string, companyNumber: string): string =>
    url.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
