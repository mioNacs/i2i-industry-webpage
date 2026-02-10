import { 
    getAboutHeroData, 
    getAboutIntoData, 
    getAboutSubhamData, 
    getAboutKaushalData, 
    getAboutPhotos, 
    getStatsSection 
} from '@/lib/contentful/client'

import AboutHero from "@/components/sections/about/about-hero";
import AboutIntro from "@/components/sections/about/about-intro";
import Founders from "@/components/sections/about/founders";
import AboutImpact from "@/components/sections/about/impact";
import Photos from "@/components/sections/photos"; // Reusing existing photos component if suitable, or create new.
import CTASection from "@/components/sections/cta-section"; // Reusing generic CTA

export default async function AboutPage() {
    const [
        statsResponse,
        heroResponse,
        introResponse,
        subhamResponse,
        kaushalResponse,
        photosResponse,
    ] = await Promise.all([
        getStatsSection(),
        getAboutHeroData(),
        getAboutIntoData(),
        getAboutSubhamData(),
        getAboutKaushalData(),
        getAboutPhotos()
    ])

    // Mock data for development if Contentful data is missing
    const MOCK_FOUNDER_SUBHAM = {
        name: "Subham Kumar",
        designation: "Founder & CEO",
        description: "A visionary leader with a passion for education and technology...",
        photo: { url: "/img_shubham.jpeg" }, // Using local public image
        linkedIn: "https://linkedin.com/in/subham"
    };

    const MOCK_FOUNDER_KAUSHAL = {
        name: "Kaushal Kumar",
        designation: "Co-Founder",
        description: "Technical architect driving the innovation at i2i...",
        photo: { url: "/img_kaushal.jpg" }, // Using local public image
        linkedIn: "https://linkedin.com/in/kaushal"
    };

    const MOCK_STATS = [
        { key: "Highest CTC", value: "20LPA" },
        { key: "Success Rate", value: "95.7%" },
        { key: "Avg. Salary Hike", value: "125%" },
        { key: "Career Transitions", value: "1250+" }
    ];

    const MOCK_PHOTOS = [
        "/img_seminar_one.jpg",
        "/img_seminar_two.jpeg",
        "/img_seminar_three.jpeg",
        "/img_seminar_four.jpg",
        "/img_seminar_five.jpg",
        "/img_seminar_six.jpeg"
    ];

    const stats = statsResponse?.data?.statsSectionCollection?.items.length 
        ? statsResponse.data.statsSectionCollection.items 
        : MOCK_STATS;

    const hero = heroResponse?.data?.aboutHeroSectionCollection?.items?.[0];
    const intro = introResponse?.data?.aboutIntroSectionCollection?.items?.[0];

    const subham = subhamResponse?.data?.aboutFounderSubhamCollection?.items?.[0] || MOCK_FOUNDER_SUBHAM;
    const kaushal = kaushalResponse?.data?.aboutFounderKaushalCollection?.items?.[0] || MOCK_FOUNDER_KAUSHAL;

    // Use Contentful photos if available, otherwise use mock photos
    // Note: The structure might be deep: items[0].photosCollection.items...
    const impactPhotos = photosResponse?.data?.aboutPhotosCollection?.items?.[0]?.photosCollection?.items?.map(p => p.url) || MOCK_PHOTOS;
    
    return (
        <main className="min-h-screen">
            <AboutHero data={hero || {
                title: "Empowering the Next Generation of Tech Leaders",
                quote: "Education is the passport to the future.",
                highlights: ["Tech Leaders", "Education", "Future"],
                image: { url: "/img_about_hero.jpg" }
            }} />
            
            <AboutIntro data={intro || {
                title: "Job-driven online Tech-versity",
                description: "i2i Technologies is dedicated to transforming education through industry-relevant skills and mentorship.",
                photo: { url: "/img_what_is_i2i.jpg" }
            }} />

            <Founders subham={subham} kaushal={kaushal} />
            
            {/* Impact Section including Photos */}
            <AboutImpact stats={stats} photos={impactPhotos} />
            
            <CTASection />
        </main>
    )
}
