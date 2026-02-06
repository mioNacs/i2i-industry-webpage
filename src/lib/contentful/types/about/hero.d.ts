export interface AboutHeroResponse {
  data: {
    aboutHeroSectionCollection: {
      items: {
        title: string;
        quote: string;
        highlights: string[];
        image: { fileName: string; url: string };
      }[];
    };
  };
}
