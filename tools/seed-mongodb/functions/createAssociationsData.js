import { createAssociation } from "./createAssociation.js";

export function createAssociations (users, companies) {

    const associations = [];

    users.forEach(user => {

        const numCompanies = Math.floor(Math.random() * companies.length) + 1;

        const shuffledCompanies = companies.sort(() => 0.5 - Math.random());

        for (let i = 0; i < numCompanies; i++) {
            const company = shuffledCompanies[i];
            const association = createAssociation(user, users, company);
            associations.push(association);
        }
    });
    return associations;
}

// This will call createAssociation to create 1 or multiple associations for each user
