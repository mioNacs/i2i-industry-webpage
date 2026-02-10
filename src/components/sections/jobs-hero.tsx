import { HiBriefcase, HiSearch, HiLocationMarker, HiCheckCircle, HiClock, HiCurrencyDollar, HiLightningBolt } from "react-icons/hi";
import { FaGoogle, FaAmazon, FaMicrosoft, FaAirbnb } from "react-icons/fa";
import Link from 'next/link';

export default function JobsHero() {
    return (
        <div className='flex flex-col lg:flex-row w-full bg-gradient-to-br from-primary/5 via-accent/5 to-white relative overflow-hidden'>
            
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] animate-pulse" />
            </div>

            {/* Left Content */}
            <div className='flex-1 flex flex-col justify-center p-8 lg:p-20 gap-8 relative z-10'>

                <h1 className="text-4xl md:text-6xl font-black font-sans leading-tight text-gray-900">
                    Find Your Dream Job <br />
                    <span className='bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                        In Minutes
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 font-sans max-w-xl leading-relaxed">
                    Access <span className="font-bold text-gray-900">exclusive opportunities</span> from top tech companies. 
                    Get matched with roles that fit your skills and career goals perfectly.
                </p>
            </div>

            
        </div>
    )
}
