import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";

export default function AboutFounder() {
  return (
    <section className="w-full bg-gray-900 py-24 px-4 md:px-8 lg:px-16 text-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl mix-blend-screen animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl mix-blend-screen animate-pulse" style={{ animationDelay: '2s'}} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
            <div className="inline-block p-2 rounded-full border-2 border-white/10 bg-white/5 backdrop-blur-md mb-8">
               <Image
                    src="/img_shubham.jpeg"
                    alt="Subham Kumar Singh - Founder"
                    width={180}
                    height={180}
                    className="rounded-full object-cover w-32 h-32 md:w-48 md:h-48"
                /> 
            </div>
            
            <FaQuoteLeft className="text-4xl md:text-6xl text-primary/30 mx-auto mb-6" />
            
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                "We don't just teach. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    We transform careers.
                </span>"
            </h2>
            
            <blockquote className="text-lg md:text-2xl text-gray-300 leading-relaxed italic mb-10 font-light">
                "At I2I Industry, we believe education must translate into real-world impact. 
                Our focus is clear — bridge the gap between academic learning and industry expectations 
                through practical exposure, innovation, and outcome-driven training."
            </blockquote>
            
            <div className="flex flex-col items-center">
                <p className="font-bold text-white text-2xl">Subham Kumar Singh</p>
                <p className="text-primary font-medium tracking-widest uppercase text-sm mt-2">Founder, I2I Industry</p>
            </div>
        </div>
    </section>
  );
}
