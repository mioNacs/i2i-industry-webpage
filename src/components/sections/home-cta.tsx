import Link from 'next/link'
import React from 'react'
import { FaUserTie, FaUniversity, FaBriefcase } from 'react-icons/fa'
import AnimateOnScroll from '@/components/ui/animate-on-scroll'

export default function HomeCTA() {
    const CTA_Items = [
        {
            title: "For Job Seekers",
            subtitle: "Find your dream job",
            href: "/jobs",
            icon: <FaBriefcase size={24} />,
            iconClass: "bg-primary/10 text-primary",

        },
        {
            title: "For Professionals",
            subtitle: "Upskilling & Career Transformation",
            href: "/jobs",
            icon: <FaUserTie size={24} />,
            iconClass: "bg-yellow-50 text-yellow-600",
        },
        {
            title: "For Colleges",
            subtitle: "Shape your future",
            href: "/course",
            icon: <FaUniversity size={24} />,
            iconClass: "bg-accent/10 text-accent",
        }
    ]
  return (
    <div className='hidden md:flex flex-col md:flex-row justify-around py-6 items-center bg-gray-50/50'>
        {CTA_Items.map((item, index) => (
            <AnimateOnScroll key={index} delay={index * 100}>
                <Link
                    href={item.href}
                    className="group flex items-center gap-4 bg-white p-5 pr-8 rounded-2xl shadow-sm border border-gray-100 border-b-2 hover:border-b-accent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-w-[300px]"
                >
                    <div className={`p-3 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 ${item.iconClass}`}>
                        {item.icon}
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="font-bold text-gray-900 text-lg">{item.title}</span>
                        <span className="text-gray-500 text-sm font-medium">{item.subtitle}</span>
                    </div>
                </Link>
            </AnimateOnScroll>
        ))}
    </div>
  )
}