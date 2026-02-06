export interface PhotosResponse {
  data: {
    photosCollection: {
      items: {
        photosCollection: { items: { url: string; fileName: string }[] };
      }[];
    };
  };
}
