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
