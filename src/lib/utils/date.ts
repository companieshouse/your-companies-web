import { DateTime } from "luxon";
import { createAndLogError } from "../Logger";

export const toReadableFormat = (dateToConvert: string): string => {
    if (!dateToConvert) {
        return "";
    }
    const jsDate = new Date(dateToConvert);
    const dateTime = DateTime.fromJSDate(jsDate);
    const convertedDate = dateTime.toFormat("d MMMM yyyy");

    if (convertedDate === "Invalid DateTime") {
        throw createAndLogError(
            `Unable to convert provided date ${dateToConvert}`
        );
    }

    return convertedDate;
};
