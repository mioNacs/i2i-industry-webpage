export interface AboutKaushalResponse {
  data: {
    aboutFounderKaushalCollection: {
      items: { description: string; photo: { url: string; fileName: string } }[];
    };
  };
}
