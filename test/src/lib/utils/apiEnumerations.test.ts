
/* eslint-disable import/first */

const READABLE_COMPANY_STATUS = "Receiver Action";
const READABLE_COMPANY_TYPE = "Private limited company";
const KEY_RECEIVERSHIP = "receivership";
const KEY_LTD = "ltd";
const KEY = "key";

jest.mock("js-yaml", () => {
    return {
        load: jest.fn(() => {
            return {
                company_status: {
                    [KEY_RECEIVERSHIP]: READABLE_COMPANY_STATUS
                },
                company_type: {
                    [KEY_LTD]: READABLE_COMPANY_TYPE
                }
            };
        })
    };
});

import {
    lookupCompanyStatus,
    lookupCompanyType
} from "../../../../src/lib/utils/api_enumerations";

describe("api enumeration tests", () => {

    it("should return a readable company type description when given a company type key", () => {
        const readableCompanyType: string = lookupCompanyType(KEY_LTD);
        expect(readableCompanyType).toEqual(READABLE_COMPANY_TYPE);
    });

    it("should return original key when there is no match for the company type key", () => {
        const readableCompanyType: string = lookupCompanyType(KEY);
        expect(readableCompanyType).toEqual(KEY);
    });

    it("should return a readable company status description when given a company status key", () => {
        const readableCompanyStatus: string = lookupCompanyStatus(KEY_RECEIVERSHIP);
        expect(readableCompanyStatus).toEqual(READABLE_COMPANY_STATUS);
    });

    it("should return original key when there is no match for the company status key", () => {
        const readableCompanyStatus: string = lookupCompanyStatus(KEY);
        expect(readableCompanyStatus).toEqual(KEY);
    });
});
