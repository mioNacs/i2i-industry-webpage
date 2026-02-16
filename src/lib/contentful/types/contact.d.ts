export interface ContactResponse {
  data: { contactCollection: { items: ContactItem[] } };
}
export interface ContactItem {
  email: string;
  phoneNumber: string;
  address?: string;
  addresses?: unknown;
}
