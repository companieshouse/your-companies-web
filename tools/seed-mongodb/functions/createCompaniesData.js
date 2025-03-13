import { createCompany } from "./createCompany.js";

export function createCompanies (count) {
    const companies = [];

    for (let i = 0; i < count; i += 1) {
        const company = createCompany();
        companies.push(company);
    }

    return companies;
}

// This will call 'createCompany()' and create a list of X amount of companies
