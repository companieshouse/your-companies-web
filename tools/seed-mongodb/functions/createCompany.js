import { faker } from "@faker-js/faker";

export function createCompany () {

    const companyName = `COMP${faker.string.numeric(3)}`;
    const company = {
        _id: companyName,
        data: {
            company_number: companyName,
            company_name: faker.company.name(),
            company_status: "active"
        }
    };

    return company;
}

// This wil create a single company profile
