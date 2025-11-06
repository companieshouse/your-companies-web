import fs from "fs";
import path from "path";
import enCommon from "../../../locales/en/common.json";
import cyCommon from "../../../locales/cy/common.json";

const englishDirectory = "../../../locales/en/";
const welshDirectory = "../../../locales/cy/";

const englishTranslationFiles = fs.readdirSync(path.resolve(__dirname, englishDirectory));
const englishTranslationFilesExcludeCommon = englishTranslationFiles.filter(str => str !== "common.json");
const welshTranslationFiles = fs.readdirSync(path.resolve(__dirname, welshDirectory));
const welshTranslationFilesExcludeCommon = welshTranslationFiles.filter(str => str !== "common.json");

const findMissingKeys = function (
    original: Record<string, unknown>,
    toCheck: Record<string, unknown>,
    previousPath = "",
    output: string[] = []
) {
    for (const key in original) {
        const currentPath = previousPath ? `${previousPath} -> ${key}` : key;

        if (typeof original[key] === "object") {
            if (toCheck !== undefined) {
                findMissingKeys(
                    original[key] as Record<string, unknown>,
                    toCheck[key] as Record<string, unknown>,
                    currentPath,
                    output
                );
            } else {
                findMissingKeys(original[key] as Record<string, unknown>, {}, currentPath, output);
            }
        } else {

            if (toCheck === undefined || toCheck[key] === undefined) {
                output.push(`No match for: ${currentPath}`);
            }
        }

    }
    return output;
};

function haveAnyMatchingKeys (obj1: Record<string, unknown>, obj2: Record<string, unknown>) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const matchingKeys = keys1.filter(key => keys2.includes(key));
    if (matchingKeys.length > 0) {
        console.log("Matching keys with common found:", matchingKeys);
        return true;
    }
    return false;
}

function haveSameValueForAnyKey (

    obj1: Record<string, any>, obj2: Record<string, any>, path = ""): boolean {
    for (const key in obj1) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj1.hasOwnProperty(key)) {
            const newPath = path ? `${path}.${key}` : key; // Track the key path

            // eslint-disable-next-line no-prototype-builtins
            if (obj2.hasOwnProperty(key)) {
                if (
                    typeof obj1[key] === "object" &&
                    obj1[key] !== null &&
                    typeof obj2[key] === "object" &&
                    obj2[key] !== null
                ) {
                    if (haveSameValueForAnyKey(obj1[key], obj2[key], newPath)) {
                        return true;
                    }
                } else if (obj1[key] === obj2[key]) {
                    console.log(`Matching key with same value found: "${newPath}" -> ${obj1[key]}`);
                    return true;
                }
            }
        }
    }

    return false;
}

describe("Check translation json files", () => {
    it("There should not be any missing translation files for welsh translations", () => {
        const missingFiles = englishTranslationFiles.filter(x => !welshTranslationFiles.includes(x));
        expect(missingFiles).toEqual([]);
    });

    it("There should not be any missing translation files for english translations", () => {
        const missingFiles = welshTranslationFiles.filter(x => !englishTranslationFiles.includes(x));
        expect(missingFiles).toEqual([]);
    });

    test.each(welshTranslationFiles)("Check english translation file %s has no missing keys", file => {
        const englishFile = fs.readFileSync(path.resolve(__dirname, englishDirectory + file), "utf-8");
        const welshFile = fs.readFileSync(path.resolve(__dirname, welshDirectory + file), "utf-8");
        const englishContents = JSON.parse(englishFile) as Record<string, unknown>;
        const welshContents = JSON.parse(welshFile) as Record<string, unknown>;
        expect(findMissingKeys(welshContents, englishContents)).toEqual([]);
    });

    test.each(englishTranslationFiles)("Check welsh translation file %s has no missing keys", file => {
        const englishFile = fs.readFileSync(path.resolve(__dirname, englishDirectory + file), "utf-8");
        const welshFile = fs.readFileSync(path.resolve(__dirname, welshDirectory + file), "utf-8");
        const englishContents = JSON.parse(englishFile);
        const welshContents = JSON.parse(welshFile);
        expect(findMissingKeys(englishContents, welshContents)).toEqual([]);
    });

    test.each(welshTranslationFiles)("Check english, welsh translation file %s has no values the same", file => {
        const englishFile = fs.readFileSync(path.resolve(__dirname, englishDirectory + file), "utf-8");
        const welshFile = fs.readFileSync(path.resolve(__dirname, welshDirectory + file), "utf-8");
        const englishContents = JSON.parse(englishFile) as Record<string, unknown>;
        const welshContents = JSON.parse(welshFile) as Record<string, unknown>;
        expect(haveSameValueForAnyKey(welshContents, englishContents)).toEqual(false);
    });

    test.each(englishTranslationFilesExcludeCommon)("Check english translation file %s has no shared keys with common", file => {
        const englishFile = fs.readFileSync(path.resolve(__dirname, englishDirectory + file), "utf-8");
        const englishContents = JSON.parse(englishFile);
        expect(haveAnyMatchingKeys(englishContents, enCommon)).toBe(false);
    });

    test.each(welshTranslationFilesExcludeCommon)("Check welsh translation file %s has no shared keys with common", file => {
        const welshFile = fs.readFileSync(path.resolve(__dirname, welshDirectory + file), "utf-8");
        const welshContents = JSON.parse(welshFile);
        expect(haveAnyMatchingKeys(welshContents, cyCommon)).toBe(false);
    });
});
