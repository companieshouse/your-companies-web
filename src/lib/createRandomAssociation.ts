import { faker } from "@faker-js/faker";
import { Association } from "../types/associations";

export function createRandomAssociation (): Association {
    return {
        id: faker.string.uuid(),
        userId: "qwertyiop",
        userEmail: "demo@ch.gov.uk",
        companyNumber: Math.random().toString().slice(2, 10),
        companyName: faker.company.name().toUpperCase(),
        status: "confirmed",
        invitations:
            [
                {
                    invitedBy: "5544332211",
                    invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                }
            ]
    };
}

export const fakeAssociations: Association[] = faker.helpers.multiple(createRandomAssociation, {
    count: 150
});

// export const fakeAssociations: Association[] =
// if exists return it otherwise gen new
