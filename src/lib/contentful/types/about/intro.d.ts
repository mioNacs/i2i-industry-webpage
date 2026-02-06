export interface AboutIntroResponse {
  data: {
    aboutIntroSectionCollection: {
      items: { title: string; description: string; photo: { url: string } }[];
    };
  };
}
