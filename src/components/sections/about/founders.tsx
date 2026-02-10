import Image from "next/image";
import SectionHeader from "@/components/ui/section-header";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

interface FounderData {
    description: string; // The type is likely rich text or string, assuming raw string or we might need a parser if it's rich text. Old code used simple render.
    photo: { url: string };
}

interface FoundersProps {
    subham: FounderData;
    kaushal: FounderData;
}

export default function Founders({ subham, kaushal }: FoundersProps) {
    return (
        <section className="py-20 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <SectionHeader 
                    title={<>Meet Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Founders</span></>}
                    subtitle="Behind our vision and success are two dynamic leaders who bring distinct expertise and unwavering dedication to the table."
                />

                <div className="flex flex-col gap-24 mt-16 max-w-6xl mx-auto">
                    {/* Founder 1 - Subham */}
                    <FounderCard 
                        name="Subham Kumar Singh"
                        role="Co-Founder"
                        data={subham}
                        reverse={false}
                    />

                    {/* Founder 2 - Kaushal */}
                    <FounderCard 
                         name="Kaushal Kumar Singh"
                         role="Co-Founder"
                         data={kaushal}
                         reverse={true}
                    />
                </div>
            </div>
        </section>
    )
}

function FounderCard({ name, role, data, reverse }: { name: string, role: string, data: FounderData, reverse: boolean }) {
    return (
        <AnimateOnScroll>
            <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}>
                
                {/* Image Section */}
                <div className="flex-1 w-full max-w-md relative group">
                    <div className={`absolute top-4 ${reverse ? 'left-4 bg-primary/10 border-primary' : 'right-4 bg-accent/10 border-accent'} border-2 w-full h-full rounded-2xl group-hover:top-6 group-hover:${reverse ? 'left-6' : 'right-6'} transition-all duration-500`}></div>
                    <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[1] border border-gray-100 bg-white">
                        <Image
                            src={data.photo.url}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                         <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                            <p className="text-white font-bold text-xl">{name}</p>
                            <p className="text-white/80 text-sm uppercase tracking-wider">{role}</p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-6 text-center lg:text-left">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{name}</h3>
                    <div className={`w-20 h-1 rounded-full ${reverse ? 'bg-primary' : 'bg-accent'} mx-auto lg:mx-0`}></div>
                    
                    <div className="prose prose-lg text-gray-600 leading-relaxed font-sans">
                        {/* Assuming description is plain string based on old legacy code usage `{subham.description}` */}
                        {data.description}
                    </div>
                </div>

            </div>
        </AnimateOnScroll>
    )
}
