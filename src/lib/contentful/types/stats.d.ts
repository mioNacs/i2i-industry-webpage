export interface StatsSectionResponse {
  data: {
    statsSectionCollection: { items: { key: string; value: string }[] };
  };
}
