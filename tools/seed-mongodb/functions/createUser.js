import { faker } from "@faker-js/faker";
import { DEFAULT_PASSWORD, EMAIL_DOMAIN } from "../config.js";

export function createUser () {
    const user = {
        _id: faker.string.uuid().replace(/-/g, "").toUpperCase(),
        password: DEFAULT_PASSWORD
    };

    const forename = faker.person.firstName();
    const surname = faker.person.lastName();
    user.email = faker.internet.email({ firstName: `inugami_test_data_${forename}`, lastName: surname, provider: EMAIL_DOMAIN }).toLowerCase();
    return user;
}

// This wil create a single user profile
