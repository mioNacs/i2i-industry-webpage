export interface PreferredChoiceResponse {
  data: {
    preferedChoiceCollection: { items: { title: string; description: string }[] };
  };
}
