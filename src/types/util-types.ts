export type AnyRecord = Record<string, any>;

export type ViewData = {
  lang: AnyRecord;
  errors?:
    | {
        [key: string]: {
          text: string;
        };
      }
    | undefined;
    companyNumber?: string;
    companyName?: string;
    backLinkHref?:string;
};

export type CompanyNameAndNumber = {
    companyName: string,
    companyNumber: string,
}
