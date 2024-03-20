import { Association } from "../../types/associations";
import { LANDING_URL, ITEMS_PER_PAGE } from "../../constants";
import { PageItem, PaginationData } from "../../types/pagination";

export const buildPaginationElement = (
    currentPageNumber: number,
    numOfPages: number,
    urlPrefix: string,
    searchQuery: string
): PaginationData => {
    const pagination: PaginationData = { items: [] };
    const pageItems: PageItem[] = [];

    if (numOfPages <= 1 || currentPageNumber < 1) return pagination;

    // Add Previous and Next
    if (currentPageNumber !== 1) {
        pagination.previous = {
            href: `${urlPrefix}?page=${currentPageNumber - 1}${searchQuery}`
        };
    }
    if (currentPageNumber !== numOfPages) { pagination.next = { href: `${urlPrefix}?page=${currentPageNumber + 1}${searchQuery}` }; }

    // Add first element by default
    pageItems.push(createPageItem(1, currentPageNumber, false, urlPrefix, searchQuery));

    // Add second element if applicable - possible ellipsis
    if (numOfPages >= 3) {
        const isEllipsis = numOfPages >= 5 && currentPageNumber >= 5;
        pageItems.push(createPageItem(2, currentPageNumber, isEllipsis, urlPrefix, searchQuery));
    }

    // Add element at middle left position if applicable
    if (
        numOfPages >= 5 &&
    currentPageNumber >= 4 &&
    numOfPages - currentPageNumber >= 1
    ) {
        pageItems.push(
            createPageItem(currentPageNumber - 1, currentPageNumber, false, urlPrefix, searchQuery)
        );
    }

    // Add element at middle position if applicable
    if (
        numOfPages >= 5 &&
    currentPageNumber >= 3 &&
    numOfPages - currentPageNumber >= 2
    ) {
        pageItems.push(
            createPageItem(currentPageNumber, currentPageNumber, false, urlPrefix, searchQuery)
        );
    }

    // Add element at middle right position if applicable
    if (
        numOfPages >= 5 &&
    currentPageNumber >= 2 &&
    numOfPages - currentPageNumber >= 3
    ) {
        pageItems.push(
            createPageItem(currentPageNumber + 1, currentPageNumber, false, urlPrefix, searchQuery)
        );
    }

    // Add second-to-last element if applicable - possible ellipsis
    if (numOfPages >= 4) {
        const isEllipsis = numOfPages >= 5 && numOfPages - currentPageNumber >= 4;
        pageItems.push(
            createPageItem(numOfPages - 1, currentPageNumber, isEllipsis, urlPrefix, searchQuery)
        );
    }

    // Add last element if applicable
    if (numOfPages > 1) {
        pageItems.push(
            createPageItem(numOfPages, currentPageNumber, false, urlPrefix, searchQuery)
        );
    }

    pagination.items = pageItems;
    return pagination;
};

const createPageItem = (
    pageNumber: number,
    currentPageNumber: number,
    isEllipsis: boolean,
    prefix: string,
    searchQuery: string
): PageItem => {
    if (isEllipsis) {
        return {
            ellipsis: true
        };
    }
    return {
        current: currentPageNumber === pageNumber,
        number: pageNumber,
        href: `${prefix}?page=${pageNumber}${searchQuery}`
    };
};

export const sortAndSearch = (
    items: Association[],
    search: string
): Association[] | undefined => {
    if (!items?.length) {
        return;
    }

    // sort
    items.sort((a, b) => {
        if (a.companyName < b.companyName) {
            return -1;
        }
        if (a.companyName > b.companyName) {
            return 1;
        }
        return 0;
    });

    // filter / search
    if (search && search.length) {
        items = items.filter((item) => {
            return (
                item.companyName.includes(search.toUpperCase()) ||
        item.companyNumber.includes(search.toUpperCase())
            );
        });
    }

    return items;
};

export const paginatedSection = (
    items: Association[] | undefined,
    page: number
): Association[] | undefined => {
    // paginated associations for display
    if (!items?.length) {
        return;
    }
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
};

export const paginationElement = (
    page: number,
    arrayLength: number,
    search: string
): PaginationData | undefined => {
    // Create pagination element to navigate pages
    const numOfPages = Math.ceil(arrayLength / ITEMS_PER_PAGE);
    return buildPaginationElement(
        page, // current page
        numOfPages,
        LANDING_URL,
        search
    );
};
