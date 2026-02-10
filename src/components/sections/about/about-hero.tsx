import Image from "next/image";
import SectionHeader from "@/components/ui/section-header";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";
import { highlightWords } from "@/lib/utils";

interface AboutHeroProps {
    data: {
        title: string;
        quote: string;
        highlights: string[];
        image: { url: string };
    }
}

export default function AboutHero({ data }: AboutHeroProps) {
    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-white via-primary/5 to-accent/10 py-10 lg:py-14">
             {/* Decorative Elements */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                    
                    {/* Left Content */}
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <AnimateOnScroll>
                            <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-tight">
                                {highlightWords(data.title, data.highlights)}
                            </h1>
                        </AnimateOnScroll>

                        <AnimateOnScroll delay={0.2}>
                            <div className="relative p-6 bg-white border-2 border-black rounded-2xl shadow-lg inline-block text-left">
                                <span className="absolute top-4 left-4 text-4xl text-primary/50 font-serif">“</span>
                                <p className="text-lg italic font-medium relative z-10 px-6">
                                    {data.quote}
                                </p>
                                <span className="absolute bottom-4 right-4 text-4xl text-primary/50 font-serif rotate-180">“</span>
                            </div>
                        </AnimateOnScroll>
                    </div>

                     {/* Right Content - Image */}
                     <div className="flex-1 w-full max-w-lg relative">
                        <AnimateOnScroll delay={0.3}>
                             <div className="relative aspect-square">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-[2rem] transform rotate-3 opacity-20 blur-lg"></div>
                                <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white ring-2 ring-black">
                                    <Image
                                        src={data.image.url}
                                        alt="About i2i"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                        priority
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
