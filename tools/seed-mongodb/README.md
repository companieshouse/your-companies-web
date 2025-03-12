# MongoDB Test Data Generator

Adds users, companies and user-company associations and company authentication code data to MongoDB.

## Setup and Usage

1. In the project directory, install dependencies:
   ```bash
   npm install
   ```

2. Run the script:
   ```bash
   node index.js
   ```

## Environment Options

Use the `USE_ENV` variable to specify the MongoDB configuration:

```bash
USE_ENV=cidev node index.js
```

Pre-configured environments:
- `local` (default): Uses localhost MongoDB
- `phoenix`: Uses Phoenix development MongoDB
- `cidev`: Uses CI development MongoDB

## Custom Environment Variables

You can customize the script using these environment variables:

- `MONGODB_URI`: Override the MongoDB connection string
- `MONGODB_PASSWORD`: Set a custom default password for generated users (default: "password")
- `NO_USERS_TO_CREATE`: Specify the number of users to generate (default: 50)
- `NO_COMPANIES_TO_CREATE`: Specify the number of companies to generate (default: 10)

Example usage:
```bash
USE_ENV=phoenix NO_USERS_TO_CREATE=50 MONGODB_PASSWORD=custompass node index.js
```

```bash
export USE_ENV=phoenix 
export MONGODB_PASSWORD=custompass 
export NO_USERS_TO_CREATE=10
export NO_COMPANIES_TO_CREATE=5 
node index.js
```

## Configuration

The `config.js` file contains pre-configured MongoDB URIs and default values. You can modify this file to add or change environments and default settings. Here's an example of how to add a new environment:

```diff
const mongodbConfigs = {
    local: "mongodb://localhost:27017",
    phoenix: "mongodb+srv://phoenix_dev@phoenix-dev-pl-0.ueium.mongodb.net/admin?...",
    cidev: "mongodb+srv://phoenix_dev@phoenix-dev-pl-0.ueium.mongodb.net/admin?...",
+   staging: "mongodb+srv://staging_user@staging-cluster.example.net/admin?..."
};
```

Environment variables will override the values in `config.js` when provided.