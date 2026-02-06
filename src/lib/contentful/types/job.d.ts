export default interface JobsResponse {
  data: { jobCollection: { items: JobItem[] } };
}
export interface JobItem {
  sys: { firstPublishedAt: string };
  name: string;
  location: string;
  salary: string | null;
  jobOverview: string;
  companyName: string;
  companyIcon: { url: string };
}
