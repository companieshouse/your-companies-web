import { faker } from "@faker-js/faker";
import { Association } from "../types/associations";

const addLimitedSometimes = () => {
    return Math.floor(Math.random() * 4) === 0 ? " LIMITED" : "";
};

export function createRandomAssociation (): Association {
    return {
        id: faker.string.uuid(),
        userId: "qwertyiop",
        userEmail: "demo@ch.gov.uk",
        companyNumber: faker.number.int({ min: 9999999, max: 100000000 }).toString(),
        companyName: faker.company.name().toUpperCase() + addLimitedSometimes(),
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

export const randomAssociations: Association[] = faker.helpers.multiple(createRandomAssociation, {
    count: 150
});
