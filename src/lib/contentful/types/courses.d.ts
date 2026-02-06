export interface CoursesResponse {
  data: { coursesCollection: { items: CourseItem[] } };
}
export interface CourseItem {
  sys: { id: string };
  name: string;
  learningPoints: string[];
  startDate: string;
  module: Module[];
  description: string;
  duration: string;
  sessions: string;
  mode: string;
  targetAudience: string;
  prerequisites: null | string;
  image: { url: string };
}
export interface Module {
  data: string[];
  name: string;
}
