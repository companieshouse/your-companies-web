export interface PageItem {
    number?: number;
    href?: string;
    current?: boolean;
    ellipsis?: boolean;
  }

export interface PaginationPreviousNext {
    href: string;
  }

export interface PaginationData {
    previous?: PaginationPreviousNext;
    next?: PaginationPreviousNext;
    items: PageItem[];
  }
