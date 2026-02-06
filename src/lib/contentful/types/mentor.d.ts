export interface MentorResponse {
  data: { mentorCollection: { items: MentorItem[] } };
}
export interface MentorItem {
  name: string;
  description: string;
  linkedin: string;
  photo: { url: string };
}
