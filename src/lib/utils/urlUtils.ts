import * as constants from "../../constants";

export const getUrlWithCompanyNumber = (url: string, companyNumber: string): string =>
    url.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);

export const appendToRecord = (str:string, sourceObj:Record<string, string>) => {
    const newObj:Record<string, string> = {};
    Object.keys(sourceObj).forEach(key => {
        newObj[key] = str + sourceObj[key];
    });
    return newObj;
};
