export interface TestimonialsResponse {
  data: {
    testimonialCollection: {
      items: {
        name: string;
        testimonial: string;
        rating: number;
        image: { url: string };
      }[];
    };
  };
}
