export interface PageItem {
    number?: number,
    href?: string,
    current?: boolean,
    ellipsis?: boolean
  }

export interface PaginationPreviousNext {
    href: string
  }

export interface PaginationData {
    previous?: PaginationPreviousNext,
    next?: PaginationPreviousNext,
    items: PageItem[]
  }

export const buildPaginationElement = (currentPageNumber: number, numOfPages: number, urlPrefix: string): PaginationData => {
    const pagination: PaginationData = { items: [] };
    const pageItems: PageItem[] = [];
    if (numOfPages <= 1 || currentPageNumber < 1) return pagination;

    // Add Previous and Next
    if (currentPageNumber !== 1) pagination.previous = { href: `${urlPrefix}?page=${currentPageNumber - 1}` };
    if (currentPageNumber !== numOfPages) pagination.next = { href: `${urlPrefix}?page=${currentPageNumber + 1}` };

    // Add first element by default
    pageItems.push(createPageItem(1, currentPageNumber, false, urlPrefix));

    // Add second element if applicable - possible ellipsis
    if (numOfPages >= 3) {
        const isEllipsis = numOfPages >= 5 && currentPageNumber >= 5;
        pageItems.push(createPageItem(2, currentPageNumber, isEllipsis, urlPrefix));
    }

    // Add element at middle left position if applicable
    if (numOfPages >= 5 && currentPageNumber >= 4 && numOfPages - currentPageNumber >= 1) {
        pageItems.push(createPageItem(currentPageNumber - 1, currentPageNumber, false, urlPrefix));
    }

    // Add element at middle position if applicable
    if (numOfPages >= 5 && currentPageNumber >= 3 && numOfPages - currentPageNumber >= 2) {
        pageItems.push(createPageItem(currentPageNumber, currentPageNumber, false, urlPrefix));
    }

    // Add element at middle right position if applicable
    if (numOfPages >= 5 && currentPageNumber >= 2 && numOfPages - currentPageNumber >= 3) {
        pageItems.push(createPageItem(currentPageNumber + 1, currentPageNumber, false, urlPrefix));
    }

    // Add second-to-last element if applicable - possible ellipsis
    if (numOfPages >= 4) {
        const isEllipsis = numOfPages >= 5 && numOfPages - currentPageNumber >= 4;
        pageItems.push(createPageItem(numOfPages - 1, currentPageNumber, isEllipsis, urlPrefix));
    }

    // Add last element if applicable
    if (numOfPages > 1) {
        pageItems.push(createPageItem(numOfPages, currentPageNumber, false, urlPrefix));
    }

    pagination.items = pageItems;
    return pagination;
};

const createPageItem = (pageNumber: number, currentPageNumber: number, isEllipsis: boolean, prefix: string): PageItem => {
    if (isEllipsis) {
        return {
            ellipsis: true
        };
    }
    return {
        current: currentPageNumber === pageNumber,
        number: pageNumber,
        href: `${prefix}?page=${pageNumber}`
    };
};
