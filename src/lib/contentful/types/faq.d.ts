export interface FaqResponse {
  data: { faqCollection: { items: { questionAnswers: QuestionAnswer[] }[] } };
}
export interface QuestionAnswer {
  title: string;
  answer: string;
}
