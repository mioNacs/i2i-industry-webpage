import Link from "next/link";
import Image from "next/image";
import { LuMail, LuPhone } from "react-icons/lu";
import { BsChevronRight } from "react-icons/bs";
import { getContact, getCourses } from "@/lib/contentful/client";
import { socialLinks } from "@/lib/constants";
import Logo from "../../../public/logo.png";

export default async function Footer() {
  const [contactResponse, coursesResponse] = await Promise.all([
    getContact(),
    getCourses(),
  ]);

  const courses = coursesResponse.data.coursesCollection.items;
  const contactData = contactResponse.data.contactCollection.items[0];
  const { email, phoneNumber: phone, address } = contactData;

  const resources = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <footer className="font-sans w-full px-4 sm:px-8 lg:px-16 flex flex-col pt-8 bg-gray-100 text-secondary-content/80">
      <div className="footer">
        {/* Logo Section */}
        <aside className="space-y-4">
          <Image
            className="w-[280px] h-[85px] object-cover border border-accent/30 rounded-lg"
            alt="i2i Industry logo"
            src={Logo}
            width={300}
            height={85}
          />
          <p className="text-sm ml-3 max-w-[350px]">
            Our platform offers a hands-on approach to learning via live
            classes, 2-step counselling, and 100% placement assistance.
          </p>
          <div className="flex gap-6 mt-6 ml-3">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className="text-gray-800 hover:text-primary transition-colors"
                >
                  <Icon className="h-6 w-6" />
                </Link>
              );
            })}
          </div>
        </aside>

        <div></div>

        {/* Stay in Touch */}
        <nav className="text-base">
          <h3 className="text-xl font-semibold mb-2 capitalize">
            Stay in touch
          </h3>
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <LuMail className="text-lg flex-shrink-0" />
              <a
                href={`mailto:${email}`}
                className="hover:underline hover:text-primary transition-colors"
              >
                {email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <LuPhone className="text-lg flex-shrink-0" />
              <a
                href={`tel:${phone}`}
                className="hover:underline hover:text-primary transition-colors"
              >
                {phone}
              </a>
            </div>
            <div className="flex items-center max-w-[280px]">
              <p>{address}</p>
            </div>
          </div>
        </nav>

        {/* Courses */}
        <nav className="text-base">
          <h3 className="text-xl font-semibold mb-2 capitalize">Courses</h3>
          <ul className="space-y-5 max-w-[280px]">
            {courses.slice(0, 3).map((course: any) => (
              <li key={course.name}>
                <Link
                  href={`/course/${course.sys.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {course.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/course/"
                className="hover:underline transition-colors text-primary flex items-center gap-2"
              >
                View All Courses <BsChevronRight />
              </Link>
            </li>
          </ul>
        </nav>

        {/* Resources */}
        <nav className="text-base">
          <h3 className="text-xl font-semibold mb-2 capitalize">Resources</h3>
          <ul className="space-y-5">
            {resources.map((resource) => (
              <li key={resource.name}>
                <Link
                  href={resource.href}
                  className="hover:text-primary transition-colors"
                >
                  {resource.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Map Section */}
      <div className="mt-12">
        <div className="w-full h-[400px] rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
            className="grayscale-[30%] hover:grayscale-0 transition-all duration-500"
          />
        </div>
        <p className="text-center mt-4 text-sm text-gray-600">
          📍 {address}
        </p>
      </div>

      <div className="p-6 text-base-content text-sm flex justify-center mt-16 pt-8 border-t border-gray-500/20">
        {`Copyright ©${new Date().getFullYear()} i2i Industry. All Rights Reserved.`}
      </div>
    </footer>
  );
}
