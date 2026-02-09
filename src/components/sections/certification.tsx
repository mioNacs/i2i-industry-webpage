import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from "@/components/ui/section-header";

// Import images
import CertificateImage from "../../../public/img_certificate.png";
import cert1 from "../../../public/certificates/cert_aws.png";
import cert2 from "../../../public/certificates/cert_google.png";
import cert3 from "../../../public/certificates/cert_ibm.png";
import cert4 from "../../../public/certificates/cert_microsoft.png";
import cert5 from "../../../public/certificates/cert_salesforce.png";
import cert6 from "../../../public/certificates/cert_zoho.png";

const certImages = [cert1, cert2, cert3, cert4, cert5, cert6];

export default function CertificationSection() {
    return (
        <section className='w-full bg-gradient-to-br from-primary/5 via-white to-accent/5 py-16 lg:py-24 font-sans'>
            <div className="container mx-auto px-4 md:px-8">
                
                {/* Main Certification Block */}
                <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-16'>
                    {/* Left Content */}
                    <div className='flex-1 space-y-6 text-center lg:text-left'>
                        <SectionHeader 
                            title="Earn a recognized career certificate"
                            subtitle="Add this credential to your LinkedIn profile, resume, or CV. Share it on social media and in your performance reviews to stand out."
                            align="left"
                        />

                        <div className="pt-4">
                            <Link href="#contact-form" className="btn btn-outline btn-primary px-8 rounded-full border-2 font-bold hover:bg-primary hover:text-white transition-all">
                                Apply For Certification
                            </Link>
                        </div>
                    </div>

                    {/* Right Content - Certificate Image */}
                    <div className='flex-1 relative w-full max-w-lg'>
                        <div className='absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2rem] blur-xl opacity-50 animate-pulse'></div>
                        <Image
                            src={CertificateImage}
                            alt='Course Certificate'
                            className='relative w-full h-auto rounded-xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500' 
                            priority
                        />
                    </div>
                </div>

                {/* Partners Strips */}
                <div className='w-full'>
                    <p className="text-center text-gray-400 font-semibold uppercase tracking-widest text-xs mb-8">Recognized By Industry Leaders</p>
                    <div className='flex flex-wrap items-center justify-center gap-6 lg:gap-12 opacity-80'>
                        {certImages.map((e, i) => (
                            <div key={i} className="w-24 md:w-32 h-16 relative grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
                                <Image
                                    src={e}
                                    alt='Certification Authority'
                                    fill
                                    className='object-contain'
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}
