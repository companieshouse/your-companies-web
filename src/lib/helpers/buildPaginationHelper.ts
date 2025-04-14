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
    searchQuery: string
): PaginationData => {
    const pagination: PaginationData = { items: [] };
    const pageItems: PageItem[] = [];

    // Return empty pagination if there's only one page or the current page is invalid
    if (numOfPages <= 1 || currentPageNumber < 1) return pagination;

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

    // Add the first page item
    pageItems.push(createPageItem(1, currentPageNumber, false, urlPrefix, searchQuery));

    // Add the second page item, possibly with an ellipsis
    if (numOfPages >= 3) {
        const isEllipsis = numOfPages >= 5 && currentPageNumber >= 5;
        pageItems.push(createPageItem(2, currentPageNumber, isEllipsis, urlPrefix, searchQuery));
    }

    // Add middle-left page item if applicable
    if (numOfPages >= 5 && currentPageNumber >= 4 && numOfPages - currentPageNumber >= 1) {
        pageItems.push(createPageItem(currentPageNumber - 1, currentPageNumber, false, urlPrefix, searchQuery));
    }

    // Add middle page item if applicable
    if (numOfPages >= 5 && currentPageNumber >= 3 && numOfPages - currentPageNumber >= 2) {
        pageItems.push(createPageItem(currentPageNumber, currentPageNumber, false, urlPrefix, searchQuery));
    }

    // Add middle-right page item if applicable
    if (numOfPages >= 5 && currentPageNumber >= 2 && numOfPages - currentPageNumber >= 3) {
        pageItems.push(createPageItem(currentPageNumber + 1, currentPageNumber, false, urlPrefix, searchQuery));
    }

    // Add second-to-last page item, possibly with an ellipsis
    if (numOfPages >= 4) {
        const isEllipsis = numOfPages >= 5 && numOfPages - currentPageNumber >= 4;
        pageItems.push(createPageItem(numOfPages - 1, currentPageNumber, isEllipsis, urlPrefix, searchQuery));
    }

    // Add the last page item
    if (numOfPages > 1) {
        pageItems.push(createPageItem(numOfPages, currentPageNumber, false, urlPrefix, searchQuery));
    }

    pagination.items = pageItems;
    return pagination;
};

/**
 * Creates a page item for the pagination.
 * @param pageNumber - The page number for the item.
 * @param currentPageNumber - The current page number.
 * @param isEllipsis - Whether the item should be an ellipsis.
 * @param prefix - The base URL for the page link.
 * @param searchQuery - Additional query string for search.
 * @returns A PageItem object.
 */
const createPageItem = (
    pageNumber: number,
    currentPageNumber: number,
    isEllipsis: boolean,
    prefix: string,
    searchQuery: string
): PageItem => {
    return isEllipsis
        ? { ellipsis: true }
        : {
            current: currentPageNumber === pageNumber,
            number: pageNumber,
            href: `${prefix}?page=${pageNumber}${searchQuery}`
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
