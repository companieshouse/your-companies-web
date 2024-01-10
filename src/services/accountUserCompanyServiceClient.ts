import Axios, { AxiosInstance } from "axios";
import { COMPANY_INFO_API_URL } from "../constants";
import { CompanyInfoResponse } from "types/CompanyInfoResponse";
import { toCamelCase } from "../lib/utils/transformationUtils";
import logger from "../lib/Logger";

export class AccountUserCompanyServiceClient {
    client: AxiosInstance;

    constructor (baseURL: string) {
        this.client = Axios.create({
            baseURL
        });
    }

    async getCompanyInfoForCompanyNumber (companyNumber: string): Promise<CompanyInfoResponse | undefined> {
        try {
            const response = await this.client.get(`${COMPANY_INFO_API_URL}/${companyNumber}`);
            const companyInfoResponse: CompanyInfoResponse = toCamelCase(response.data);
            return companyInfoResponse;
        } catch (error: any) {
            logger.error(error);
        }
    }
}
