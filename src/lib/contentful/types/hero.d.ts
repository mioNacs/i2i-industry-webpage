export interface HeroResponse {
  data: {
    heroSectionCollection: {
      items: { title: string; subtitle: string; highlights: string[] }[];
    };
  };
}
