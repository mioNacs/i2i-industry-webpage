export interface CoursesResponse {
  data: { courseCollection: { items: CourseItem[] } };
}
export interface CourseItem {
  sys: { id: string };
  title: string;
  name?: string; // Keeping for legacy compatibility if needed
  overviewPoints: string[];
  image: { url: string };
  tiers: { items: CourseTier[] };
  startingPrice?: number;
  description?: string; // Marking as optional as it wasn't in the fetch
}

export interface CourseTier {
  sys: { id: string };
  title: string;
  tier: string;
  durationMonths: string;
  durationHours: number;
  academicDuration: string;
  internshipDuration: string;
  programFees: number; // Changed to number based on JSON
  gstPercentage?: number;
  modules: TierModule[];
  toolsCovered: string[];
  careerOpportunities: string[];
  admissionEligibility: string;
  certificationRequirements: string;
  internshipDetails?: InternshipDetails;
}

export interface TierModule {
  name: string;
  points: string[];
}

export interface InternshipDetails {
  timeline: {
    period: string;
    tasks: string[];
  }[];
  final_deliverables: string[];
}
