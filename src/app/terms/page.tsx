import { getTermsAndConditions } from "@/lib/contentful/client";
import SectionHeader from "@/components/ui/section-header";
import RichTextRenderer from "@/components/ui/rich-text-renderer";

export default async function TermsPage() {
    let termsData = null;
    
    try {
        const response = await getTermsAndConditions();
        termsData = response?.data?.termsAndConditionsCollection?.items?.[0]?.termsAndConditions?.json;
    } catch (error) {
        console.error("Error fetching Terms data:", error);
    }

    if (!termsData) {
        // Fallback or Empty State if data is missing
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8">
                   <h1 className="text-2xl font-bold text-gray-900 mb-2">Terms Unavailable</h1>
                   <p className="text-gray-600">Could not load the terms and conditions at this time.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="w-full min-h-screen font-sans bg-gray-50 pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 mb-12">
                <div className="container mx-auto px-4 py-4 md:py-4 text-center">
                     <SectionHeader 
                        title={<>Terms & <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Conditions</span></>}
                        subtitle="Please read these terms carefully before using our services."
                        align="center"
                        className="mb-0"
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 lg:p-16">
                    <article className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary hover:prose-a:text-accent prose-li:text-gray-600">
                        <RichTextRenderer content={termsData} />
                    </article>
                    
                    <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
