export interface TeachingPartnersResponse {
  data: {
    teachingPartnersCollection: {
      items: { partnersCollection: { items: { url: string }[] } }[];
    };
  };
}
