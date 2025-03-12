import { MONGODB_URI, NO_COMPANIES_TO_CREATE, NO_USERS_TO_CREATE, USE_DIRECT_CONNECTION } from "./config.js";
import { MongoClient } from "mongodb";
import { createUsers } from "./functions/createUsersData.js";
import { createCompanies } from "./functions/createCompaniesData.js";
import { createAssociations } from "./functions/CreateAssociationsData.js";
import { createAuthCodes } from "./functions/createAuthCodes.js";

async function main () {
    const client = new MongoClient(MONGODB_URI, { directConnection: USE_DIRECT_CONNECTION });

    try {
        await client.connect();
        await listDatabases(client);

        // create data for users
        const users = createUsers(NO_USERS_TO_CREATE);
        // create data for companies
        const companies = createCompanies(NO_COMPANIES_TO_CREATE);
        // create data for associations
        const associations = createAssociations(users, companies);
        // create data for authentication codes
        const authCodes = createAuthCodes(companies);

        await addUsersDataToMongo(client, users);
        await addCompaniesDataToMongo(client, companies);
        await addAssociationsDataToMongo(client, associations);
        await addAuthCodesDataToMongo(client, authCodes);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function listDatabases (client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

async function addUsersDataToMongo (client, newUsers) {
    const result = await client
        .db("account")
        .collection("users")
        .insertMany(newUsers);

    console.log(
        `${result.insertedCount} new users(s) created with the following ids:`
    );
    console.log(result.insertedIds);
}

async function addCompaniesDataToMongo (client, acsp) {
    const result = await client
        .db("company_profile")
        .collection("company_profile")
        .insertMany(acsp);

    console.log(
        `${result.insertedCount} new companies created with the following ids:`
    );
    console.log(result.insertedIds);
}

async function addAssociationsDataToMongo (client, associationsData) {
    const result = await client
        .db("user_company_associations")
        .collection("user_company_associations")
        .insertMany(associationsData);

    console.log(
        `${result.insertedCount} new association(s) created with the following ids:`
    );
    console.log(result.insertedIds);
}

async function addAuthCodesDataToMongo (client, authCodeData) {
    const result = await client
        .db("account")
        .collection("company_auth_codes")
        .insertMany(authCodeData);

    console.log(
        `${result.insertedCount} new authentication code data created with the following ids:`
    );
    console.log(result.insertedIds);
}

main().catch(console.error);
