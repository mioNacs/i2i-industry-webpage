import { Document } from "@contentful/rich-text-types";
export interface TermsResponse {
  data: {
    termsAndConditionsCollection: {
      items: { termsAndConditions: { json: Document } }[];
    };
  };
}
