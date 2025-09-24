import { buildPaginationElement, stringToPositiveInteger, setLangForPagination } from "../../../../../src/lib/helpers/buildPaginationHelper";
import { PaginationData } from "../../../../../src/types/pagination";
import { AnyRecord } from "../../../../../src/types/utilTypes";

const prefix = "prefix";
const ellipsis = "...";

/**
 * Validate every component of the pagination element object. Including:
 *  - Previous Button - Whether it is available
 *  - Next Button - Whether it is available
 *  - PageItem:
 *      - Current Number - Whether it is the current page being displayed
 *      - Ellipses - Whether a non-clickable ellipsis is being displayed instead of a clickable page number
 *      - Page Numbers & Links - Whether page numbers are correctly set and links to that page number have been created
 * @param expectedData Object representing the expected pagination element data
 * @param numOfPages The total number of pages available
 * @param prefix URL Prefix to prepend to links
 * @param currentPageNumber The current page number rendered on screen
 */
function validatePaginationElement (expectedData: { previous: boolean; items: string[]; next: boolean; }, numOfPages: number, prefix: string, currentPageNumber: number, lang: AnyRecord) {
    const paginationElement = buildPaginationElement(currentPageNumber, numOfPages, prefix, "", lang);

    // Validate previous link
    if (expectedData.previous) {
        expect(paginationElement.previous).toEqual({ href: prefix + "?page=" + (currentPageNumber - 1) });
    } else {
        expect(paginationElement.previous).toBeNull;
    }

    // Validate next link
    if (expectedData.next) {
        expect(paginationElement.next).toEqual({ href: prefix + "?page=" + (currentPageNumber + 1) });
    } else {
        expect(paginationElement.next).toBeNull;
    }

    // Validate items
    expect(paginationElement.items).toHaveLength(expectedData.items.length);
    expect(paginationElement.items.length).toBeLessThanOrEqual(7);

    for (let i = 0; i < paginationElement.items.length; i++) {
        const expectedItem = expectedData.items[i];
        const paginationItem = paginationElement.items[i];

        // Current Number
        if (currentPageNumber === Number(expectedItem)) {
            expect(paginationItem.current).toBeTruthy();
        } else {
            expect(paginationItem.current).toBeFalsy();
        }

        // Ellipses or Page Numbers / Links
        if (expectedItem === ellipsis) {
            expect(paginationItem.ellipsis).toBeTruthy();
            expect(paginationItem.href).toBeUndefined();
        } else {
            expect(paginationItem.ellipsis).toBeFalsy();
            expect(paginationItem.number).toEqual(Number(expectedItem));
            expect(paginationItem.href).toEqual(prefix + "?page=" + paginationItem.number);
        }
    }
}

describe("Pagination element test suite", () => {

    const lang = {};

    it.each([
        [1, { previous: false, items: [], next: false }]
    ])("1 page, current page number = %p", (currentPageNumber: number, expectedData: { previous: boolean; items: string[]; next: boolean; }) => {
        const numOfPages = 1;
        validatePaginationElement(expectedData, numOfPages, prefix, currentPageNumber, lang);
    });

    it.each([
        [1, { previous: false, items: ["1", "2"], next: true }],
        [2, { previous: true, items: ["1", "2"], next: false }]
    ])("2 pages, current page number = %p", (currentPageNumber: number, expectedData: { previous: boolean; items: string[]; next: boolean; }) => {
        const numOfPages = 2;
        validatePaginationElement(expectedData, numOfPages, prefix, currentPageNumber, lang);
    });

    it.each([
        [1, { previous: false, items: ["1", "2", "3"], next: true }],
        [2, { previous: true, items: ["1", "2", "3"], next: true }],
        [3, { previous: true, items: ["1", "2", "3"], next: false }]
    ])("3 pages, current page number = %p", (currentPageNumber: number, expectedData: { previous: boolean; items: string[]; next: boolean; }) => {
        const numOfPages = 3;
        validatePaginationElement(expectedData, numOfPages, prefix, currentPageNumber, lang);
    });

    it.each([
        [1, { previous: false, items: ["1", "2", "3", "4"], next: true }],
        [2, { previous: true, items: ["1", "2", "3", "4"], next: true }],
        [3, { previous: true, items: ["1", "2", "3", "4"], next: true }],
        [4, { previous: true, items: ["1", "2", "3", "4"], next: false }]
    ])("4 pages, current page number = %p", (currentPageNumber: number, expectedData: { previous: boolean; items: string[]; next: boolean; }) => {
        const numOfPages = 4;
        validatePaginationElement(expectedData, numOfPages, prefix, currentPageNumber, lang);
    });

    it.each([
        [1, { previous: false, items: ["1", "2", "...", "5"], next: true }],
        [2, { previous: true, items: ["1", "2", "3", "4", "5"], next: true }],
        [3, { previous: true, items: ["1", "2", "3", "4", "5"], next: true }],
        [4, { previous: true, items: ["1", "2", "3", "4", "5"], next: true }],
        [5, { previous: true, items: ["1", "...", "4", "5"], next: false }]
    ])("5 pages, current page number = %p", (currentPageNumber: number, expectedData: { previous: boolean; items: string[]; next: boolean; }) => {
        const numOfPages = 5;
        validatePaginationElement(expectedData, numOfPages, prefix, currentPageNumber, lang);
    });

    it.each([
        [1, { previous: false, items: ["1", "2", "...", "6"], next: true }],
        [2, { previous: true, items: ["1", "2", "3", "...", "6"], next: true }],
        [3, { previous: true, items: ["1", "2", "3", "4", "5", "6"], next: true }],
        [4, { previous: true, items: ["1", "2", "3", "4", "5", "6"], next: true }],
        [5, { previous: true, items: ["1", "...", "4", "5", "6"], next: true }],
        [6, { previous: true, items: ["1", "...", "5", "6"], next: false }]
    ])("6 pages, current page number = %p", (currentPageNumber: number, expectedData: { previous: boolean; items: string[]; next: boolean; }) => {
        const numOfPages = 6;
        validatePaginationElement(expectedData, numOfPages, prefix, currentPageNumber, lang);
    });

    it.each([
        [1, { previous: false, items: ["1", "2", "...", "7"], next: true }],
        [2, { previous: true, items: ["1", "2", "3", "...", "7"], next: true }],
        [3, { previous: true, items: ["1", "2", "3", "4", "...", "7"], next: true }],
        [4, { previous: true, items: ["1", "2", "3", "4", "5", "6", "7"], next: true }],
        [5, { previous: true, items: ["1", "...", "4", "5", "6", "7"], next: true }],
        [6, { previous: true, items: ["1", "...", "5", "6", "7"], next: true }],
        [7, { previous: true, items: ["1", "...", "6", "7"], next: false }]
    ])("7 pages, current page number = %p", (currentPageNumber: number, expectedData: { previous: boolean; items: string[]; next: boolean; }) => {
        const numOfPages = 7;
        validatePaginationElement(expectedData, numOfPages, prefix, currentPageNumber, lang);
    });

    it.each([
        [1, { previous: false, items: ["1", "2", "...", "8"], next: true }],
        [2, { previous: true, items: ["1", "2", "3", "...", "8"], next: true }],
        [3, { previous: true, items: ["1", "2", "3", "4", "...", "8"], next: true }],
        [4, { previous: true, items: ["1", "2", "3", "4", "5", "...", "8"], next: true }],
        [5, { previous: true, items: ["1", "...", "4", "5", "6", "7", "8"], next: true }],
        [6, { previous: true, items: ["1", "...", "5", "6", "7", "8"], next: true }],
        [7, { previous: true, items: ["1", "...", "6", "7", "8"], next: true }],
        [8, { previous: true, items: ["1", "...", "7", "8"], next: false }]
    ])("8 pages, current page number = %p", (currentPageNumber: number, expectedData: { previous: boolean; items: string[]; next: boolean; }) => {
        const numOfPages = 8;
        validatePaginationElement(expectedData, numOfPages, prefix, currentPageNumber, lang);
    });

    it.each([
        [1, { previous: false, items: ["1", "2", "...", "9"], next: true }],
        [2, { previous: true, items: ["1", "2", "3", "...", "9"], next: true }],
        [3, { previous: true, items: ["1", "2", "3", "4", "...", "9"], next: true }],
        [4, { previous: true, items: ["1", "2", "3", "4", "5", "...", "9"], next: true }],
        [5, { previous: true, items: ["1", "...", "4", "5", "6", "...", "9"], next: true }],
        [6, { previous: true, items: ["1", "...", "5", "6", "7", "8", "9"], next: true }],
        [7, { previous: true, items: ["1", "...", "6", "7", "8", "9"], next: true }],
        [8, { previous: true, items: ["1", "...", "7", "8", "9"], next: true }],
        [9, { previous: true, items: ["1", "...", "8", "9"], next: false }]
    ])("9 pages, current page number = %p", (currentPageNumber: number, expectedData: { previous: boolean; items: string[]; next: boolean; }) => {
        const numOfPages = 9;
        validatePaginationElement(expectedData, numOfPages, prefix, currentPageNumber, lang);
    });

    it.each([
        [1, { previous: false, items: ["1", "2", "...", "10"], next: true }],
        [2, { previous: true, items: ["1", "2", "3", "...", "10"], next: true }],
        [3, { previous: true, items: ["1", "2", "3", "4", "...", "10"], next: true }],
        [4, { previous: true, items: ["1", "2", "3", "4", "5", "...", "10"], next: true }],
        [5, { previous: true, items: ["1", "...", "4", "5", "6", "...", "10"], next: true }],
        [6, { previous: true, items: ["1", "...", "5", "6", "7", "...", "10"], next: true }],
        [7, { previous: true, items: ["1", "...", "6", "7", "8", "9", "10"], next: true }],
        [8, { previous: true, items: ["1", "...", "7", "8", "9", "10"], next: true }],
        [9, { previous: true, items: ["1", "...", "8", "9", "10"], next: true }],
        [10, { previous: true, items: ["1", "...", "9", "10"], next: false }]
    ])("10 pages, current page number = %p", (currentPageNumber: number, expectedData: { previous: boolean; items: string[]; next: boolean; }) => {
        const numOfPages = 10;
        validatePaginationElement(expectedData, numOfPages, prefix, currentPageNumber, lang);
    });

    it.each([
        [2, { previous: true, items: ["1", "2", "3", "...", "22"], next: true }],
        [7, { previous: true, items: ["1", "...", "6", "7", "8", "...", "22"], next: true }],
        [13, { previous: true, items: ["1", "...", "12", "13", "14", "...", "22"], next: true }],
        [17, { previous: true, items: ["1", "...", "16", "17", "18", "...", "22"], next: true }],
        [20, { previous: true, items: ["1", "...", "19", "20", "21", "22"], next: false }]
    ])("22 pages, current page number = %p", (currentPageNumber: number, expectedData: { previous: boolean; items: string[]; next: boolean; }) => {
        const numOfPages = 22;
        validatePaginationElement(expectedData, numOfPages, prefix, currentPageNumber, lang);
    });
});

describe("setLangForPagination", () => {
    it("should set pagination texts with the provided texts", () => {
        // Given
        const pagination = {
            previous: {
                href: "/"
            },
            next: {
                href: "/"
            },
            items: [],
            landmarkLabel: "Page"
        } as PaginationData;
        const translations = {
            next: "Next",
            next_page: "Next page",
            previous: "Previous",
            previous_page: "Previous page"
        };
        // When
        setLangForPagination(pagination, translations);
        // Then
        expect(pagination.next?.text).toEqual(translations.next);
        expect(pagination.next?.attributes?.["aria-label"]).toEqual(translations.next_page);
        expect(pagination.previous?.text).toEqual(translations.previous);
        expect(pagination.previous?.attributes?.["aria-label"]).toEqual(translations.previous_page);
    });

    it("should not throw an error if pagination data not provided", () => {
        const pagination = undefined;
        const translations = {
            next: "Next",
            next_page: "Next page",
            previous: "Previous",
            previous_page: "Previous page"
        };

        expect(() => setLangForPagination(pagination, translations)).not.toThrow();
    });
});

describe("stringToPositiveInteger should convert page query param to a positive integer, 1 or greater", () => {
    it.each([
        { page: "3", expected: 3 },
        { page: "2", expected: 2 },
        { page: "200", expected: 200 },
        { page: "03.5", expected: 3 },
        { page: "", expected: 1 },
        { page: "1/5", expected: 1 },
        { page: "-2", expected: 1 },
        { page: "abc", expected: 1 },
        { page: "0", expected: 1 },
        { page: "undefined", expected: 1 }
    ])("should return $expected for $page", ({ page, expected }) => {
        expect(stringToPositiveInteger(page)).toEqual(expected);
    });
});
