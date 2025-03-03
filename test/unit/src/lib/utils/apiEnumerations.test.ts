
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
} from "../../../../../src/lib/utils/api_enumerations";

describe("api enumeration tests", () => {

    test.each([
        // Given
        {
            returnInfo: "a readable company type description",
            condition: "given a company type key",
            lookupFuntion: lookupCompanyType,
            argument: KEY_LTD,
            expectedResult: READABLE_COMPANY_TYPE
        },
        {
            returnInfo: "original key",
            condition: "there is no match for the company type key",
            lookupFuntion: lookupCompanyType,
            argument: KEY,
            expectedResult: KEY
        },
        {
            returnInfo: "a readable company status description",
            condition: "given a company status key",
            lookupFuntion: lookupCompanyStatus,
            argument: KEY_RECEIVERSHIP,
            expectedResult: READABLE_COMPANY_STATUS
        },
        {
            returnInfo: "original key",
            condition: "there is no match for the company status key",
            lookupFuntion: lookupCompanyStatus,
            argument: KEY,
            expectedResult: KEY
        }
    ])("should return $returnInfo when $condition",
        ({ lookupFuntion, argument, expectedResult }) => {
            // When
            const result: string = lookupFuntion(argument);
            // Then
            expect(result).toEqual(expectedResult);
        });
});
