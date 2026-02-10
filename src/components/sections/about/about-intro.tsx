import Image from "next/image";
import SectionHeader from "@/components/ui/section-header";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

import versityImg from "../../../../public/img_versity.png";
import mentorshipImg from "../../../../public/img_mentorship.png";
import inDepthImg from "../../../../public/img_depth_verse.png";

interface AboutIntroProps {
    data: {
        title: string;
        description: string;
        photo: { url: string };
    }
}

const features = [
    {
        title: "Job-driven online Tech-versity",
        img: versityImg
    },
    {
        title: "Mentorship by industry stalwarts",
        img: mentorshipImg
    },
    {
        title: "Forward-Looking course curriculum",
        img: inDepthImg
    }
]

export default function AboutIntro({ data }: AboutIntroProps) {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
                    
                    {/* Left Content */}
                    <div className="flex-1 space-y-8">
                        <SectionHeader 
                            title={<>Bridging the Gap Between <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Academia and Industry</span></>}
                            subtitle={data.description}
                            align="left"
                            className="mb-8"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                            {features.map((feature, idx) => (
                                <AnimateOnScroll key={idx} delay={idx * 0.1 + 0.2}>
                                    <div className="flex flex-col items-center gap-4 text-center p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="relative w-24 h-24 mb-2">
                                            <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl scale-75"></div>
                                            <Image 
                                                src={feature.img} 
                                                alt={feature.title} 
                                                className="w-full h-full object-contain relative z-10"
                                            />
                                        </div>
                                        <p className="font-bold text-gray-800 text-sm leading-tight">
                                            {feature.title}
                                        </p>
                                    </div>
                                </AnimateOnScroll>
                            ))}
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 w-full flex justify-center">
                        <AnimateOnScroll>
                            <div className="relative w-full max-w-md">
                                <div className="absolute inset-0 bg-accent/10 border-2 border-accent rounded-3xl transform rotate-12 scale-95"></div>
                                <div className="relative rounded-2xl overflow-hidden border-4 border-white bg-white">
                                    <Image
                                        src={data.photo.url}
                                        alt="What is i2i"
                                        width={500}
                                        height={400}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </AnimateOnScroll>
                    </div>

                </div>
            </div>
        </section>
    )
}
