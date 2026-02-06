import { Document } from "@contentful/rich-text-types";
export interface PrivacyResponse {
  data: {
    privacyPolicyCollection: {
      items: { privacyPolicy: { json: Document } }[];
    };
  };
}
