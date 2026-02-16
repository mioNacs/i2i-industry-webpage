import React from 'react'
import Image from "next/image"
import Link from "next/link"
import { 
    FaGraduationCap, 
    FaIndustry, 
    FaLightbulb, 
    FaRocket, 
    FaUserTie, 
    FaChartLine,
    FaDatabase,
    FaChartBar,
    FaRobot,
    FaLaptopCode,
    FaComments,
    FaMicrochip,
    FaCheckCircle,
    FaBuilding,
    FaEye,
    FaQuoteLeft
} from "react-icons/fa"
import Container from '@/components/ui/container'

export default function AboutPage() {
    return (
        <div className='w-full h-full flex flex-col font-sans overflow-hidden'>
            {/* 1️⃣ HERO SECTION */}
            <section className="w-full bg-white pt-20 pb-32 px-4 md:px-8 lg:px-16">
                <Container className="flex-col items-start gap-8">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#222222] leading-tight">
                            Transforming Education Into{' '}
                            <span className="relative">
                                Employability
                                <span className="absolute bottom-2 left-0 w-full h-2 bg-[#0E63FF]/20"></span>
                            </span>
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
                            Transforming ambitions into achievements.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link 
                                href="/course" 
                                className="px-6 py-3 bg-[#0E63FF] text-white font-semibold rounded-lg hover:bg-[#0E63FF]/90 transition-colors"
                            >
                                Explore Programs
                            </Link>
                            <Link 
                                href="/contact" 
                                className="px-6 py-3 border-2 border-[#0E63FF] text-[#0E63FF] font-semibold rounded-lg hover:bg-[#0E63FF]/5 transition-colors"
                            >
                                Talk to Mentor
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 2️⃣ WHO WE ARE */}
            <section className="w-full bg-white py-20 px-4 md:px-8 lg:px-16">
                <Container>
                    {/* Left - Text Block */}
                    <div className="flex-1 flex flex-col gap-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#222222]">
                            Who We Are
                        </h2>
                        <div className="w-20 h-1 bg-[#0E63FF]"></div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            I2I Industry is a premier education and career transformation platform dedicated to bridging the gap between academic learning and industry requirements. We empower students and professionals with practical skills, industry-relevant knowledge, and comprehensive career support to succeed in today&apos;s competitive job market.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Our mission is to transform education into employability by providing outcome-driven training programs that prepare individuals for real-world challenges.
                        </p>
                    </div>
                    
                    {/* Right - Hero Image */}
                    <div className="flex-1 flex items-center justify-center mt-8 lg:mt-0">
                        <div className="relative">
                            <Image
                                src="/img_about_hero.jpg"
                                alt="About I2I Industry"
                                width={500}
                                height={400}
                                className="rounded-lg shadow-xl object-cover"
                            />
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#0E63FF] rounded-lg flex items-center justify-center">
                                <FaGraduationCap className="text-white text-4xl" />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 3️⃣ WHAT I2I STANDS FOR */}
            <section className="w-full bg-[#F9F9F9] py-20 px-4 md:px-8 lg:px-16">
                <Container className="flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#222222] text-center">
                        What I2I Stands For
                    </h2>
                    <div className="w-20 h-1 bg-[#0E63FF] mx-auto mt-4"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full">
                        {/* Card 1 */}
                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-[#0E63FF]/10 rounded-full flex items-center justify-center mb-6">
                                <FaRocket className="text-[#0E63FF] text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-[#222222] mb-4">Invest to Impact</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Every investment in education creates lasting impact. We focus on transforming your educational journey into measurable career outcomes.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-[#0E63FF]/10 rounded-full flex items-center justify-center mb-6">
                                <FaIndustry className="text-[#0E63FF] text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-[#222222] mb-4">Institute to Industry</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We bridge the gap between academic institutions and industry expectations, preparing you for real-world success.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-[#0E63FF]/10 rounded-full flex items-center justify-center mb-6">
                                <FaLightbulb className="text-[#0E63FF] text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-[#222222] mb-4">Innovation to Impact</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Fostering innovation that creates tangible impact. We nurture creative thinking and practical problem-solving skills.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 4️⃣ THE GAP WE SOLVE */}
            <section className="w-full bg-white py-20 px-4 md:px-8 lg:px-16">
                <Container>
                    {/* Left - Bulleted List */}
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-8">
                            The Gap We Solve
                        </h2>
                        <div className="space-y-4">
                            {[
                                "Traditional education lacks practical industry exposure",
                                "Skills mismatch between academic curriculum and job requirements",
                                "Limited access to mentorship from industry professionals",
                                "Insufficient career guidance and placement support",
                                "Lack of hands-on projects and real-world experience"
                            ].map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <FaCheckCircle className="text-[#0E63FF] mt-1 flex-shrink-0" />
                                    <p className="text-gray-600 text-lg">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Bold Statement */}
                    <div className="flex-1 flex items-center justify-center mt-8 lg:mt-0">
                        <div className="bg-[#0E63FF] rounded-xl p-8 md:p-12 text-center">
                            <FaQuoteLeft className="text-white/30 text-4xl mx-auto mb-6" />
                            <p className="text-white text-xl md:text-2xl font-semibold leading-relaxed">
                                "We bridge the gap between what you learn and what the industry needs."
                            </p>
                            <p className="text-white/80 mt-6 text-lg">
                                Our comprehensive approach ensures you&apos;re not just qualified, but truly industry-ready.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 5️⃣ STATS & IMPACT */}
            <section className="w-full bg-[#F9F9F9] py-20 px-4 md:px-8 lg:px-16">
                <Container className="flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#222222] text-center">
                        Our Impact in Numbers
                    </h2>
                    <div className="w-20 h-1 bg-[#0E63FF] mx-auto mt-4 mb-12"></div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full">
                        <div className="text-center p-6 bg-white rounded-xl shadow-md">
                            <div className="text-4xl md:text-5xl font-bold text-[#0E63FF]">95%+</div>
                            <div className="text-gray-600 mt-2 font-medium">Placement &amp; Internship Rate</div>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-md">
                            <div className="text-4xl md:text-5xl font-bold text-[#0E63FF]">1,250+</div>
                            <div className="text-gray-600 mt-2 font-medium">Students Trained</div>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-md">
                            <div className="text-4xl md:text-5xl font-bold text-[#0E63FF]">150+</div>
                            <div className="text-gray-600 mt-2 font-medium">Projects Completed</div>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-md">
                            <div className="text-4xl md:text-5xl font-bold text-[#0E63FF]">1,200+</div>
                            <div className="text-gray-600 mt-2 font-medium">Career Transitions</div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 6️⃣ TRANSFORMATION MODEL */}
            <section className="w-full bg-white py-20 px-4 md:px-8 lg:px-16">
                <Container className="flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#222222] text-center">
                        Your Transformation Journey
                    </h2>
                    <div className="w-20 h-1 bg-[#0E63FF] mx-auto mt-4 mb-12"></div>
                    
                    {/* Horizontal Steps */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-5xl">
                        {[
                            { icon: FaGraduationCap, title: "Foundation", desc: "Build strong fundamentals" },
                            { icon: FaLightbulb, title: "Applied Learning", desc: "Practical implementation" },
                            { icon: FaIndustry, title: "Industry Simulation", desc: "Real-world scenarios" },
                            { icon: FaUserTie, title: "Internship", desc: "Hands-on experience" },
                            { icon: FaChartLine, title: "Placement Support", desc: "Career launch" }
                        ].map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center relative">
                                {/* Connector Line */}
                                {index < 4 && (
                                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-[#E0E0E0] -z-10"></div>
                                )}
                                <div className="w-16 h-16 bg-[#0E63FF] rounded-full flex items-center justify-center mb-4">
                                    <step.icon className="text-white text-2xl" />
                                </div>
                                <div className="w-8 h-8 bg-[#222222] rounded-full flex items-center justify-center text-white text-sm font-bold mb-2">
                                    {index + 1}
                                </div>
                                <h3 className="font-bold text-[#222222]">{step.title}</h3>
                                <p className="text-gray-500 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* 7️⃣ CORE DOMAINS */}
            <section className="w-full bg-[#F9F9F9] py-20 px-4 md:px-8 lg:px-16">
                <Container className="flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#222222] text-center">
                        Core Domains We Cover
                    </h2>
                    <div className="w-20 h-1 bg-[#0E63FF] mx-auto mt-4 mb-12"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {[
                            { icon: FaDatabase, title: "Data Science & AI" },
                            { icon: FaChartBar, title: "Business Analytics" },
                            { icon: FaRobot, title: "Automation" },
                            { icon: FaLaptopCode, title: "IT & Healthcare Tech" },
                            { icon: FaComments, title: "Corporate Communication" },
                            { icon: FaMicrochip, title: "Emerging Technologies" }
                        ].map((domain, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#0E63FF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <domain.icon className="text-[#0E63FF] text-xl" />
                                </div>
                                <h3 className="font-semibold text-[#222222]">{domain.title}</h3>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* 8️⃣ MISSION & VISION */}
            <section className="w-full bg-white py-20 px-4 md:px-8 lg:px-16">
                <Container>
                    {/* Mission */}
                    <div className="flex-1 bg-[#F9F9F9] rounded-xl p-8 md:p-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#0E63FF] rounded-full flex items-center justify-center">
                                <FaBuilding className="text-white text-xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#222222]">Our Mission</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            To bridge the gap between academic learning and industry expectations by providing practical exposure, innovation-driven training, and outcome-focused education. We are committed to shaping professionals who are not just qualified, but truly industry-ready through comprehensive skill development and career support.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="flex-1 bg-[#F9F9F9] rounded-xl p-8 md:p-10 mt-8 lg:mt-0">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#0E63FF] rounded-full flex items-center justify-center">
                                <FaEye className="text-white text-xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#222222]">Our Vision</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            To be the leading platform that transforms education into meaningful careers, empowering individuals to achieve their professional goals while meeting the evolving demands of industries worldwide. We envision a future where every learner has access to quality, industry-relevant education that drives personal and societal growth.
                        </p>
                    </div>
                </Container>
            </section>

            {/* 9️⃣ FOUNDER MESSAGE */}
            <section className="w-full bg-white py-20 px-4 md:px-8 lg:px-16">
                <Container className="flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#222222] text-center">
                        A Message from Our Founder
                    </h2>
                    <div className="w-20 h-1 bg-[#0E63FF] mx-auto mt-4 mb-12"></div>
                    
                    <div className="max-w-3xl text-center">
                        {/* Founder Photo - Circular */}
                        <div className="mb-8">
                            <Image
                                src="/img_shubham.jpeg"
                                alt="Subham Kumar Singh - Founder"
                                width={180}
                                height={180}
                                className="rounded-full object-cover border-4 border-[#0E63FF] mx-auto"
                            />
                        </div>
                        
                        {/* Quote */}
                        <blockquote className="text-gray-600 text-lg md:text-xl leading-relaxed italic mb-8">
                            "At I2I Industry, we believe education must translate into real-world impact. 
                            Our focus is clear — bridge the gap between academic learning and industry expectations 
                            through practical exposure, innovation, and outcome-driven training. 
                            We are committed to shaping professionals who are not just qualified, but truly industry-ready."
                        </blockquote>
                        
                        {/* Founder Name */}
                        <div className="text-center">
                            <p className="font-bold text-[#222222] text-xl">Subham Kumar Singh</p>
                            <p className="text-[#0E63FF] font-medium">Founder, I2I Industry</p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 🔟 CLOSING CTA */}
            <section className="w-full bg-[#0E63FF] py-16 px-4 md:px-8 lg:px-16">
                <Container className="flex-col items-center text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Your Career Transformation Starts Here.
                    </h2>
                    <p className="text-white/90 text-lg mb-8 max-w-2xl">
                        Take the first step towards a successful career. Join thousands of students who have transformed their lives with I2I Industry.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link 
                            href="/apply" 
                            className="px-8 py-4 bg-white text-[#0E63FF] font-bold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Apply Now
                        </Link>
                        <Link 
                            href="/brochure" 
                            className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Download Brochure
                        </Link>
                    </div>
                </Container>
            </section>
        </div>
    )
}

