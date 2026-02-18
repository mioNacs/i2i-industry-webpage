import Image from "next/image";
import { FaGraduationCap } from "react-icons/fa";
import Container from "@/components/ui/container";

export default function AboutStory() {
  return (
    <section className="w-full bg-white py-20 relative overflow-hidden">
        {/* Decorative Blob */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <Container>
            {/* Left - Text Block */}
            <div className="flex-1 flex flex-col gap-8 justify-center">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#222222] leading-tight">
                        Who We Are
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>
                
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                    <p>
                        <span className="font-semibold text-gray-900">I2I Industry</span> is a premier education and career transformation platform dedicated to bridging the gap between academic learning and industry requirements.
                    </p>
                    <p>
                        We empower students and professionals with practical skills, industry-relevant knowledge, and comprehensive career support to succeed in today&apos;s competitive job market.
                    </p>
                    <p>
                        Our mission is to transform education into employability by providing outcome-driven training programs that prepare individuals for real-world challenges.
                    </p>
                </div>

                <div className="flex gap-8 pt-4">
                    <div>
                        <p className="text-4xl font-black text-primary">5+</p>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">Years Experience</p>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-accent">10k+</p>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">Students Mentored</p>
                    </div>
                </div>
            </div>
            
            {/* Right - Image */}
            <div className="flex-1 flex items-center justify-center mt-12 lg:mt-0 relative">
                <div className="relative w-full max-w-lg">
                    <div className="absolute inset-0 bg-black/5 rounded-2xl transform rotate-6 scale-95" />
                    <Image
                        src="/img_about_hero.jpg"
                        alt="About I2I Industry"
                        width={600}
                        height={500}
                        className="rounded-2xl shadow-2xl object-cover relative z-10 w-full h-[400px] lg:h-[500px]"
                    />
                    
                    {/* Floating Card */}
                    <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl flex items-center gap-4 z-20 animate-fade-in max-w-[250px]">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaGraduationCap className="text-primary text-2xl" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 leading-tight">Industry Ready</p>
                            <p className="text-xs text-gray-500 mt-1">Curriculum designed by experts</p>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    </section>
  );
}
