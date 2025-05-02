import { DateTime } from "luxon";
import { createAndLogError } from "../Logger";

/**
 * Converts a given date string into a human-readable format based on the specified language.
 *
 * @param dateToConvert - The date string to be converted. Must be in a format that can be parsed by the `Date` constructor.
 * @param lang - The language code for the desired locale. Defaults to "en" (English). If set to "cy", the date will be formatted in Welsh.
 * @returns A string representing the date in the format "d MMMM yyyy" (e.g., "1 January 2023").
 *          Returns an empty string if the input date is invalid or not provided.
 * @throws Will throw an error if the date cannot be converted and logs the error message.
 *
 * @remarks
 * - This function uses the `luxon` library's `DateTime` class to handle date formatting and localization.
 * - If the `dateToConvert` is invalid, the function will throw an error with a descriptive message.
 * - The function ensures that the locale is set to either English ("en") or Welsh ("cy").
 */
export const toReadableFormat = (dateToConvert: string, lang = "en"): string => {
    if (!dateToConvert) return "";

    const jsDate = new Date(dateToConvert);
    const dateTime = DateTime.fromJSDate(jsDate);
    const locale = lang === "cy" ? "cy" : "en";
    const convertedDate = dateTime.setLocale(locale).toFormat("d MMMM yyyy");

    if (convertedDate === "Invalid DateTime") {
        throw createAndLogError(`Unable to convert provided date ${dateToConvert}`);
    }

    return convertedDate;
};

export const isOlderThan = (dateToVerify: string, numberOfDays: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cleanedDate = cleanDateString(dateToVerify);
    const date = new Date(cleanedDate);
    date.setHours(0, 0, 0, 0);

    const daysInMilliseconds = numberOfDays * 24 * 60 * 60 * 1000;
    return date.getTime() + daysInMilliseconds <= today.getTime();
};

const cleanDateString = (dateString: string): string => {
    return dateString.includes("UTC") ? dateString.replace("UTC", "").trim() : dateString;
};
