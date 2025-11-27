
export type ApiResponse = {
 id: string,
  description: string,
  displayField: string,
  createdAt: string,
  updatedAt: string,
  message: {
    en: string,
    cy: string
  },
  startDate: string,
  endDate: string,
  severity: string,
  active: boolean,
  title: {
    en: string,
    cy: string
  },
  link: string,
  linkText: {
    en: string,
    cy: string
  }
};

export async function getBannerContentApiResponse(bannerId: string): Promise<ApiResponse> {
    console.log('banner id', bannerId);
    const mockModule = await import('./mocks/apiResonse.json');
    return mockModule.default as unknown as ApiResponse;
}
