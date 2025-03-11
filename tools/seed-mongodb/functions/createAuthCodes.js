import { AUTH_CODE } from "../config.js";

export function createAuthCodes (companies) {
    const authCodes = [];

    for (let i = 0; i < companies.length; i += 1) {
        const authCode = {
            _id: companies[i]._id,
            auth_code: AUTH_CODE,
            is_active: true
        };
        authCodes.push(authCode);
    }

    return authCodes;
}

// This will create a list of authentication codes for each company
