import { LuFacebook, LuInstagram, LuLinkedin, LuTwitter } from "react-icons/lu";

export const socialLinks = [
  {
    icon: LuLinkedin,
    href: "https://www.linkedin.com/company/i2i-learning/",
    label: "LinkedIn",
  },
  {
    icon: LuFacebook,
    href: "https://www.facebook.com/people/I2I-Industry/61570912610665/",
    label: "Facebook",
  },
  {
    icon: LuInstagram,
    href: "https://www.instagram.com/i2i.industry",
    label: "Instagram",
  },
  {
    icon: LuTwitter,
    href: "https://x.com/i2iindustry",
    label: "Twitter",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "About Us", href: "/about" },
] as const;

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919801209796";

export const FORMSPREE_ENDPOINT = `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID || "xzzzrkww"}`;
