/**
 * Retrieves the value of an environment variable by its key.
 * If the environment variable is not set, it returns a default value.
 *
 * @param key - The name of the environment variable to retrieve.
 * @param defaultValue - The value to return if the environment variable is not set. Defaults to an empty string.
 * @returns The value of the environment variable or the default value.
 */
export const getEnvironmentValue = (key: string, defaultValue = ""): string => {
    return process.env[key] ?? defaultValue;
};
