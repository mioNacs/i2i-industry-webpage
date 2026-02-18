import { FaBuilding, FaEye } from "react-icons/fa";
import Container from "@/components/ui/container";

export default function AboutMission() {
  return (
    <section className="w-full bg-white py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

        <Container>
            {/* Mission */}
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 md:p-12 border border-blue-100 shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 mb-8 group-hover:scale-110 transition-transform">
                        <FaBuilding className="text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#222222] mb-6">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        To bridge the gap between academic learning and industry expectations by providing practical exposure, innovation-driven training, and outcome-focused education. We are committed to shaping professionals who are not just qualified, but truly industry-ready.
                    </p>
                </div>
            </div>

            {/* Vision */}
            <div className="flex-1 bg-gradient-to-br from-orange-50 to-white rounded-3xl p-8 md:p-12 border border-orange-100 shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow mt-8 lg:mt-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-accent text-white rounded-xl flex items-center justify-center shadow-lg shadow-accent/30 mb-8 group-hover:scale-110 transition-transform">
                        <FaEye className="text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#222222] mb-6">Our Vision</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        To be the leading platform that transforms education into meaningful careers, empowering individuals to achieve their professional goals. We envision a future where every learner has access to quality, industry-relevant education that drives personal and societal growth.
                    </p>
                </div>
            </div>
        </Container>
    </section>
  );
}
