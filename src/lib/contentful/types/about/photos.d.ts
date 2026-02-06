export interface AboutPhotosResponse {
  data: {
    aboutPhotosCollection: {
      items: { photosCollection: { items: { url: string }[] } }[];
    };
  };
}
