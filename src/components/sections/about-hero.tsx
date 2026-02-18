import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";

export default function AboutHero() {
  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-br from-white via-primary/5 to-accent/10 pt-20 pb-32 px-4 md:px-8 lg:px-16">
        
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 shadow-sm mb-8 animate-fade-in">
            <FaGraduationCap className="text-primary" />
            <span className="text-sm font-semibold text-primary">Empowering Future Leaders</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-[#222222] leading-tight mb-8 max-w-5xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Transforming Education Into{' '}
            <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Employability</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 rounded-full"></span>
            </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Transforming ambitions into achievements. We bridge the gap between academic learning and industry success.
        </p>

        <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link 
                href="/course" 
                className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1"
            >
                Explore Programs
            </Link>
            <Link 
                href="/contact" 
                className="px-8 py-4 bg-white text-primary border-2 border-primary/20 font-bold rounded-lg hover:bg-primary/5 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                Talk to Mentor
            </Link>
        </div>
      </div>
    </div>
  );
}
