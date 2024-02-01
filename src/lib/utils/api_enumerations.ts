import * as fs from "fs";
import * as yaml from "js-yaml";

interface ApiEnumerationsConstants {
  [propName: string]: any
}

const apiConstantsFile = fs.readFileSync("api-enumerations/constants.yml", "utf8");
const apiConstants: ApiEnumerationsConstants = yaml.load(apiConstantsFile) as ApiEnumerationsConstants;

export const lookupCompanyType = (companyTypeKey: string): string => {
    return apiConstants.company_type[companyTypeKey] || companyTypeKey;
};

export const lookupCompanyStatus = (companyStatusKey: string): string => {
    return apiConstants.company_status[companyStatusKey] || companyStatusKey;
};
