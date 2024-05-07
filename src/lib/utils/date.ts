import { DateTime } from "luxon";
import { createAndLogError } from "../Logger";

export const toReadableFormat = (dateToConvert: string, lang = "en"): string => {
    if (!dateToConvert) {
        return "";
    }
    const jsDate = new Date(dateToConvert);
    const dateTime = DateTime.fromJSDate(jsDate);
    let convertedDate;
    switch (lang) {
    case "cy":
        convertedDate = dateTime.setLocale("cy").toFormat("d MMMM yyyy");
        break;
    case "en":
    default:
        convertedDate = dateTime.setLocale("en").toFormat("d MMMM yyyy");
        break;
    }
    if (convertedDate === "Invalid DateTime") {
        throw createAndLogError(
            `Unable to convert provided date ${dateToConvert}`
        );
    }
    return convertedDate;
};

export const isOlderThan = (dateToVerify: string, numberOfDays: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(cleanDateString(dateToVerify));
    date.setHours(0, 0, 0, 0);
    const daysInMilliseconds = numberOfDays * 24 * 60 * 60 * 1000;
    return date.getTime() + daysInMilliseconds <= today.getTime();
};

const cleanDateString = (dateString: string): string => {
    return dateString.includes("UTC") ? (dateString.replace("UTC", "")).trim() : dateString;
};
