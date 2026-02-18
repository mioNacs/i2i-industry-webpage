import { getContact, getCourses } from "@/lib/contentful/client";
import FooterClient from "./footer-client";

export default async function Footer() {
  const [contactResponse, coursesResponse] = await Promise.all([
    getContact(),
    getCourses(),
  ]);

  const courses = coursesResponse.data.courseCollection.items;
  const contactData = contactResponse.data.contactCollection.items[0] ?? {};
  const { email, phoneNumber: phone, addresses } = contactData;

  return (
    <FooterClient
      email={email}
      phone={phone}
      courses={courses}
      addresses={addresses}
    />
  );
}
