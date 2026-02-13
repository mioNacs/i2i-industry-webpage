import { HiBriefcase, HiSearch, HiLocationMarker, HiCheckCircle, HiClock, HiCurrencyDollar, HiLightningBolt, HiLockClosed } from "react-icons/hi";
import { FaGoogle, FaAmazon, FaMicrosoft, FaAirbnb } from "react-icons/fa";
import Link from 'next/link';

export default function JobsHero({ showLoginCard }: { showLoginCard?: boolean }) {
    return (
        <div className='flex flex-col lg:flex-row w-full bg-gradient-to-br from-primary/5 via-accent/5 to-white relative overflow-hidden min-h-[500px] items-center'>
            
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] animate-pulse" />
            </div>

            {/* Left Content */}
            <div className='flex-1 flex flex-col justify-center p-8 lg:p-20 gap-6 relative z-10'>

                <h1 className="text-4xl md:text-5xl font-black font-sans leading-tight text-gray-900">
                    Find Your Dream Job <br />
                    <span className='bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                        In Minutes
                    </span>
                </h1>

                <p className="text-lg text-gray-600 font-sans max-w-lg leading-relaxed">
                    Access <span className="font-bold text-gray-900">exclusive opportunities</span> from top tech companies. 
                    Get matched with roles that fit your skills and career goals perfectly.
                </p>
            </div>

            {/* Right Content - Login Card */}
            {showLoginCard && (
                <div className="flex-1 w-full flex justify-center lg:justify-end p-8 lg:p-24 relative z-10">
                    <div className="card w-full max-w-sm bg-base-100/80 backdrop-blur-sm shadow-xl border-2 border-black md:mr-6 md:scale-110">
                        <div className="card-body p-6 text-center items-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                                <HiLockClosed className="text-2xl text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Login to View Jobs
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Join our community to unlock Dream Jobs.
                            </p>
                            <div className="flex flex-col gap-3 w-full">
                                <Link href="/auth/login" className="btn btn-primary btn-sm w-full">
                                    Sign In
                                </Link>
                                <Link href="/auth/signup" className="btn btn-outline border-2 btn-sm w-full">
                                    Create Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
