import { faker } from "@faker-js/faker";

export function createCompany () {

    const companyNumber = `${faker.string.alphanumeric({ length: 2, casing: "upper" })}${faker.string.numeric(6)}`;
    const company = {
        _id: companyNumber,
        data: {
            company_number: companyNumber,
            company_name: faker.company.name(),
            company_status: "active"
        }
    };

    return company;
}

// This wil create a single company profile
