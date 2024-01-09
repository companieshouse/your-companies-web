// eslint-disable-next-line camelcase
import { faker, fakerEN_GB } from "@faker-js/faker";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";

const companyStatuses = [
    "Active",
    "Dissolved",
    "Liquidation",
    "Receivership",
    "In Admin"
];
const companyTypes = [
    "Private Unlimited Company",
    "Private Limited Company",
    "Public Limited Company",
    "Old Public Company",
    "Limited Partnership",
    "Converted/Closed"
];
export function createRandomCompanyProfile (): Partial<CompanyProfile> {
    return {
        companyName: faker.company.name(),
        companyNumber: Math.random().toString().slice(2, 10).toString(),
        companyStatus: companyStatuses[Math.floor(Math.random() * companyStatuses.length)],
        dateOfCreation: faker.date.past().toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }),
        type: companyTypes[Math.floor(Math.random() * companyTypes.length)],
        registeredOfficeAddress: {
            addressLineOne: fakerEN_GB.location.streetAddress(),
            addressLineTwo: fakerEN_GB.location.secondaryAddress(),
            locality: fakerEN_GB.location.city(),
            postalCode: fakerEN_GB.location.zipCode(),
            careOf: "ignore",
            country: "ignore",
            poBox: "string",
            premises: "string",
            region: "string"
        }
    };
}
