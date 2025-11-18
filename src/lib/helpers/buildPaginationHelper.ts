import { PageItem, PaginationData } from "../../types/pagination";
import { AnyRecord } from "../../types/utilTypes";

/**
 * Builds a pagination object containing page items, previous, and next links.
 * @param currentPageNumber - The current page number.
 * @param numOfPages - Total number of pages.
 * @param urlPrefix - The base URL for pagination links.
 * @param searchQuery - Additional query string for search.
 * @returns A PaginationData object with pagination details.
 */
export const buildPaginationElement = (
    currentPageNumber: number,
    numOfPages: number,
    urlPrefix: string,
    searchQuery: string,
    lang: AnyRecord
): PaginationData => {
    const pagination: PaginationData = {
        items: [],
        landmarkLabel: lang.page as string
    };

    // Return empty pagination if there's only one page or the current page is invalid
    if (numOfPages <= 1 || currentPageNumber < 1) {return pagination;}

    // Add "Previous" link if not on the first page
    if (currentPageNumber > 1) {
        pagination.previous = {
            href: `${urlPrefix}?page=${currentPageNumber - 1}${searchQuery}`
        };
    }

    // Add "Next" link if not on the last page
    if (currentPageNumber !== numOfPages) {
        pagination.next = {
            href: `${urlPrefix}?page=${currentPageNumber + 1}${searchQuery}`
        };
    }

    pagination.items = getPageItems(currentPageNumber, numOfPages, urlPrefix, searchQuery, lang);
    return pagination;
};

/**
 * Generates an array of page items for pagination, including regular page items
 * and ellipsis items where applicable.
 *
 * @param currentPageNumber - The current page number being viewed.
 * @param numOfPages - The total number of pages available.
 * @param urlPrefix - The URL prefix to be used for each page item.
 * @param searchQuery - The search query string to be appended to the URL.
 * @param lang - An object containing language-specific strings.
 * @returns An array of `PageItem` objects representing the pagination structure.
 *
 * The function ensures the following:
 * - Always includes the first and last page items.
 * - Adds ellipsis items when there are gaps in the pagination.
 * - Includes middle page items based on the current page and total number of pages.
 */
const getPageItems = (
    currentPageNumber: number,
    numOfPages: number,
    urlPrefix: string,
    searchQuery: string,
    lang: AnyRecord
): PageItem[] => {
    const pageItems: PageItem[] = [];
    // Add the first page item
    pageItems.push(createRegularPageItem(1, currentPageNumber, urlPrefix, searchQuery, lang));

    // Add the second page item, possibly with an ellipsis
    if (numOfPages >= 3) {
        const isEllipsis = numOfPages >= 5 && currentPageNumber >= 5;
        pageItems.push(isEllipsis ? createEllipsisItem() : createRegularPageItem(2, currentPageNumber, urlPrefix, searchQuery, lang));
    }

    // Add middle-left page item if applicable
    if (numOfPages >= 5 && currentPageNumber >= 4 && numOfPages - currentPageNumber >= 1) {
        pageItems.push(createRegularPageItem(currentPageNumber - 1, currentPageNumber, urlPrefix, searchQuery, lang));
    }

    // Add middle page item if applicable
    if (numOfPages >= 5 && currentPageNumber >= 3 && numOfPages - currentPageNumber >= 2) {
        pageItems.push(createRegularPageItem(currentPageNumber, currentPageNumber, urlPrefix, searchQuery, lang));
    }

    // Add middle-right page item if applicable
    if (numOfPages >= 5 && currentPageNumber >= 2 && numOfPages - currentPageNumber >= 3) {
        pageItems.push(createRegularPageItem(currentPageNumber + 1, currentPageNumber, urlPrefix, searchQuery, lang));
    }

    // Add second-to-last page item, possibly with an ellipsis
    if (numOfPages >= 4) {
        const isEllipsis = numOfPages >= 5 && numOfPages - currentPageNumber >= 4;
        pageItems.push(isEllipsis ? createEllipsisItem() : createRegularPageItem(numOfPages - 1, currentPageNumber, urlPrefix, searchQuery, lang));
    }

    // Add the last page item
    if (numOfPages > 1) {
        pageItems.push(createRegularPageItem(numOfPages, currentPageNumber, urlPrefix, searchQuery, lang));
    }
    return pageItems;
};

// Creates an ellipsis page item
const createEllipsisItem = (): PageItem => {
    return { ellipsis: true };
};

// Creates a regular page item
const createRegularPageItem = (
    pageNumber: number,
    currentPageNumber: number,
    prefix: string,
    searchQuery: string,
    lang: AnyRecord
): PageItem => {
    return {
        current: currentPageNumber === pageNumber,
        number: pageNumber,
        href: `${prefix}?page=${pageNumber}${searchQuery}`,
        visuallyHiddenText: `${lang.page} ${pageNumber}`
    };
};

/**
 * Sets language-specific text and attributes for pagination links.
 * @param pagination - The pagination object to update.
 * @param lang - An object containing language-specific strings.
 */
export const setLangForPagination = (pagination: PaginationData | undefined, lang: AnyRecord): void => {
    if (pagination?.next && lang.next) {
        pagination.next.text = String(lang.next);
        pagination.next.attributes = { "aria-label": lang.next_page };
    }
    if (pagination?.previous && lang.previous) {
        pagination.previous.text = String(lang.previous);
        pagination.previous.attributes = { "aria-label": lang.previous_page };
    }
};

/**
 * Converts a search string into a query parameter for search.
 * @param searchString - The search string.
 * @returns A formatted query string.
 */
export const getSearchQuery = (searchString: string): string => {
    return searchString ? `&search=${searchString}` : "";
};

/**
 * Converts a string to a positive integer. Defaults to 1 if invalid.
 * @param page - The string to convert.
 * @returns A positive integer.
 */
export const stringToPositiveInteger = (page: string): number => {
    const parsed = parseInt(page);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
};
