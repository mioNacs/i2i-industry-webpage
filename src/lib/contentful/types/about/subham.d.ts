export interface AboutSubhamResponse {
  data: {
    aboutFounderSubhamCollection: {
      items: { description: string; photo: { url: string; fileName: string } }[];
    };
  };
}
