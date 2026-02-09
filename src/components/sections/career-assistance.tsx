import Image from 'next/image';
import { HiBriefcase, HiAcademicCap, HiUserGroup } from "react-icons/hi";
import SectionHeader from "@/components/ui/section-header";
import Team1Logo from "../../../public/team_1.png"
import Team2Logo from "../../../public/team_2.png"
import Team3Logo from "../../../public/team_3.png"
import Team4Logo from "../../../public/team_4.png"
import Team5Logo from "../../../public/team_5.png"
import Team6Logo from "../../../public/team_6.png"

const teamLogos = [Team1Logo, Team2Logo, Team3Logo, Team4Logo, Team5Logo, Team6Logo];

export default function CareerAssistance() {
    return (
        <section className="w-full bg-slate-50 py-16 lg:py-24">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                    
                    {/* Left Content */}
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <SectionHeader 
                            title="Career Assistance"
                            subtitle="Secure placements in premier companies by mastering the latest in-demand skills, augmented by comprehensive mock interviews, strategic portfolio development, and polished resume crafting."
                            align="left"
                            className="bg-transparent"
                        />

                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center lg:text-left">
                                <div className="flex items-baseline justify-center lg:justify-start gap-1 text-primary mb-2">
                                    <span className="text-5xl font-black">85</span>
                                    <span className="text-3xl font-bold">%</span>
                                </div>
                                <p className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                                    Placed within 6 months
                                </p>
                            </div>

                            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center lg:text-left">
                                <div className="flex items-baseline justify-center lg:justify-start gap-1 text-primary mb-2">
                                    <span className="text-5xl font-black">350</span>
                                    <span className="text-3xl font-bold">+</span>
                                </div>
                                <p className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                                    Hiring Partners
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Team Grid */}
                    <div className="flex-1 w-full max-w-xl">
                        <div className="grid grid-cols-3 gap-4 md:gap-6 place-items-center">
                            {teamLogos.map((logo, index) => (
                                <div key={index} className="aspect-square w-full rounded-2xl bg-white border-2 border-black hover:border-gray-100 hover:shadow-md p-2 flex items-center justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                    <Image
                                        src={logo}
                                        alt={`Team member ${index + 1}`}
                                        className="w-full h-full rounded-md transition-all duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
