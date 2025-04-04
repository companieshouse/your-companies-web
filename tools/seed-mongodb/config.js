const mongodbConfigs = {
    local: "mongodb://localhost:27017",
    phoenix: "mongodb+srv://phoenix_dev@phoenix-dev-pl-0.ueium.mongodb.net/admin?retryWrites=true&replicaSet=atlas-yar7m5-shard-0&readPreference=primary&srvServiceName=mongodb&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1",
    cidev: "mongodb+srv://phoenix_dev@ci-dev-pl-0.ueium.mongodb.net/admin?retryWrites=true&loadBalanced=false&replicaSet=atlas-nrdkhn-shard-0&readPreference=primary&srvServiceName=mongodb&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1"
};

const USE_ENV = process.env.USE_ENV || "local";
const IS_LOCAL = USE_ENV === "local";
const connectionString = mongodbConfigs[USE_ENV];

const MONGODB_URI = process.env.MONGODB_URI || (
    IS_LOCAL
        ? connectionString
        : connectionString.replace("phoenix_dev@", `phoenix_dev:${process.env.MONGODB_PASSWORD}@`)
);

export const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN || "example.com";
export const USE_DIRECT_CONNECTION = IS_LOCAL;
export const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || "$2a$10$6a..eerV1kSiNW3sBlcYv.VmEXyI7ABWuoo3w7zKzcdh18YKyvPbm";
export const AUTH_CODE = "$2a$10$uS7dsFz8iIuNvXQK6dG1v.F//uQajFz0BLc60/B8qrGqsdFrU77MO";
export const NO_USERS_TO_CREATE = process.env.NO_USERS_TO_CREATE ? parseInt(process.env.NO_USERS_TO_CREATE, 10) : 50;
export const NO_COMPANIES_TO_CREATE = process.env.NO_USERS_TO_CREATE ? parseInt(process.env.NO_USERS_TO_CREATE, 10) : 10;
export { MONGODB_URI };
