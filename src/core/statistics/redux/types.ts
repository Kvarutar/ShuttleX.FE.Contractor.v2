export type ContractorStatisticsAPIResponse = {
  level: number;
  likes: number;
  rides: number;
};

export type StatisticsState = {
  contractor: ContractorStatisticsAPIResponse | null;
};
