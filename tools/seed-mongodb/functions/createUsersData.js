import { createUser } from "./createUser.js";

export function createUsers (count) {
    const users = [];

    for (let i = 0; i < count; i += 1) {
        const user = createUser();
        users.push(user);
    }

    return users;
}

// This will call 'createUser()' and create a list of X amount of users
