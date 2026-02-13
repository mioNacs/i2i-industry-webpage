import { HeroResponse } from "./types/hero";
import { CourseItem, CoursesResponse } from "./types/courses";
import { StatsSectionResponse } from "./types/stats";
import { TeachingPartnersResponse } from "./types/teaching_partners";
import { PreferredChoiceResponse } from "./types/perferred_choice";
import { TestimonialsResponse } from "./types/testimonials";
import { ContactResponse } from "./types/contact";
import { TermsResponse } from "./types/terms";
import { PrivacyResponse } from "./types/privacy";
import { PhotosResponse } from "./types/photos";
import { AboutHeroResponse } from "./types/about/hero";
import { AboutIntroResponse } from "./types/about/intro";
import { AboutSubhamResponse } from "./types/about/subham";
import { AboutKaushalResponse } from "./types/about/kaushal";
import { AboutPhotosResponse } from "./types/about/photos";
import { MentorResponse } from "./types/mentor";
import type { FaqResponse } from "./types/faq";
import type JobsResponse from "./types/job";

// ── Env-based config (no more hardcoded secrets) ──────────────────────
const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  throw new Error(
    "Contentful configuration missing. Please set NEXT_PUBLIC_CONTENTFUL_SPACE_ID and NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN environment variables."
  );
}

async function fetchGraphQL<T>(query: string): Promise<T> {
  try {
    const res = await fetch(
      `https://graphql.contentful.com/content/v1/spaces/${space}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query }),
        next: { revalidate: 120 },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Contentful API error: ${res.status} ${res.statusText} - ${errorText}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error("GraphQL Errors:", json.errors);
      // Depending on requirements, you might want to throw here or return partial data
      // For now, let's log and throw to avoid silent failures on data display
      throw new Error(`GraphQL Error: ${json.errors.map((e: any) => e.message).join(', ')}`);
    }

    return json;
  } catch (error) {
    console.error("Failed to fetch from Contentful:", error);
    throw error; // Re-throw to be handled by the caller or Next.js error boundary
  }
}

// ── Query helpers ─────────────────────────────────────────────────────

export async function getHeroSection() {
  return fetchGraphQL<HeroResponse>(`query {
    heroSectionCollection {
      items { title, subtitle, highlights: highlight }
    }
  }`);
}

export async function getStatsSection() {
  return fetchGraphQL<StatsSectionResponse>(`query {
    statsSectionCollection {
      items { key, value }
    }
  }`);
}

export async function getCourses(): Promise<CoursesResponse> {
  return fetchGraphQL<CoursesResponse>(`query {
    coursesCollection {
      items {
        sys { id }
        name, learningPoints, startDate,
        image { url }, module, description,
        duration, sessions, mode,
        targetAudience, prerequisites
      }
    }
  }`);
}

export async function getCourse(id: string) {
  return fetchGraphQL<{ data: { courses: CourseItem } }>(`query {
    courses(id: "${id}") {
      sys { id }
      name, learningPoints, startDate,
      image { url }, module, description,
      duration, sessions, mode,
      targetAudience, prerequisites
    }
  }`);
}

export async function getTeachingPartners() {
  return fetchGraphQL<TeachingPartnersResponse>(`query {
    teachingPartnersCollection {
      items {
        partnersCollection { items { url } }
      }
    }
  }`);
}

export async function getPreferredChoice() {
  return fetchGraphQL<PreferredChoiceResponse>(`query {
    preferedChoiceCollection {
      items { title, description }
    }
  }`);
}

export async function getTestimonials() {
  return fetchGraphQL<TestimonialsResponse>(`query {
    testimonialCollection {
      items {
        name, testimonial, rating,
        image { url }
      }
    }
  }`);
}

export async function getMentorData() {
  return fetchGraphQL<MentorResponse>(`query {
    mentorCollection {
      items {
        name, description, linkedin,
        photo { url }
      }
    }
  }`);
}

export async function getFAQData() {
  return fetchGraphQL<FaqResponse>(`query {
    faqCollection {
      items { questionAnswers }
    }
  }`);
}

export async function getPhotos() {
  return fetchGraphQL<PhotosResponse>(`query {
    photosCollection {
      items {
        photosCollection {
          items { url, fileName }
        }
      }
    }
  }`);
}

export async function getContact() {
  return fetchGraphQL<ContactResponse>(`query {
    contactCollection {
      items { email, phoneNumber, address }
    }
  }`);
}

export async function getJobsData() {
  return fetchGraphQL<JobsResponse>(`query {
    jobCollection {
      items {
        sys { firstPublishedAt, id },
        name, location, salary, jobOverview,
        companyIcon { url }, companyName
      }
    }
  }`);
}

export async function getPrivacyPolicies() {
  return fetchGraphQL<PrivacyResponse>(`query {
    privacyPolicyCollection {
      items { privacyPolicy { json } }
    }
  }`);
}

export async function getTermsAndConditions() {
  return fetchGraphQL<TermsResponse>(`query {
    termsAndConditionsCollection(limit: 1) {
      items { termsAndConditions { json } }
    }
  }`);
}

export async function getAboutHeroData() {
  return fetchGraphQL<AboutHeroResponse>(`query {
    aboutHeroSectionCollection {
      items {
        title, quote, highlights,
        image { fileName, url }
      }
    }
  }`);
}

export async function getAboutIntoData() {
  return fetchGraphQL<AboutIntroResponse>(`query {
    aboutIntroSectionCollection {
      items {
        title, description,
        photo { url }
      }
    }
  }`);
}

export async function getAboutSubhamData() {
  return fetchGraphQL<AboutSubhamResponse>(`query {
    aboutFounderSubhamCollection {
      items {
        description,
        photo { url, fileName }
      }
    }
  }`);
}

export async function getAboutKaushalData() {
  return fetchGraphQL<AboutKaushalResponse>(`query {
    aboutFounderKaushalCollection {
      items {
        description,
        photo { url, fileName }
      }
    }
  }`);
}

export async function getAboutPhotos() {
  return fetchGraphQL<AboutPhotosResponse>(`query {
    aboutPhotosCollection {
      items {
        photosCollection { items { url } }
      }
    }
  }`);
}
