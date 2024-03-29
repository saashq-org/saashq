const productsQueryParams = `
  productIds: [String]
  stageId: String
  pipelineId: String
`;

const commonHistoryParams = `
  page: Int,
  perPage: Int,
  sortField: String,
  sortDirection: Int,
  userId: String,
  startDate: Date,
  endDate: Date,
  contentType: String,
  contentId: String,
  searchConsume: String,
  searchSend: String,
  searchResponse: String,
  searchError: String,
`;

export const queries = `
  multiErkhetRemainders(
    ${productsQueryParams}
  ): [multiErkhetRemainder]  
  manySyncHistories(${commonHistoryParams}): [ManySyncHistory]
  manySyncHistoriesCount(${commonHistoryParams}): Int
  multiErkhetDebt(contentType: String!, contentId: String!, startDate: Date, endDate: Date, isMore: Boolean): JSON
`;
