import React from 'react';
import AboutHero from '@/components/sections/about-hero';
import AboutStory from '@/components/sections/about-story';
import AboutValues from '@/components/sections/about-values';
import AboutMission from '@/components/sections/about-mission';
import AboutFounder from '@/components/sections/about-founder';
import StatsSection from '@/components/sections/stats';
import CTASection from '@/components/sections/cta-section';

export default function AboutPage() {
    return (
        <div className='w-full h-full flex flex-col font-sans overflow-hidden'>
            <AboutHero />
            <AboutStory />
            <AboutValues />
            <StatsSection />
            <AboutMission />
            <AboutFounder />
            <CTASection />
        </div>
    )
}
