import { getFAQData } from "@/lib/contentful/client";
import { ContactUsButton } from "@/components/forms/contact-form";
import Container from "@/components/ui/container";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";
import SectionHeader from "@/components/ui/section-header";

export default async function FAQ() {
  const r = await getFAQData();
  const data = r.data.faqCollection.items
    .map((e: any) => e.questionAnswers)
    .flat();

  return (
    <Container className="py-20 gap-12">
      {/* Left Content */}
      <AnimateOnScroll className="flex flex-col gap-6 flex-1 px-0 lg:px-16 min-w-[40%]">
        <div className="text-left">
          <SectionHeader
            align="left"
            title={
              <>
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Questions
                </span>
              </>
            }
            subtitle={
              <>
                <span className="font-semibold text-primary">Still have doubts?</span> We&apos;re here to help!
              </>
            }
            className="mb-8"
          />
        </div>
        <ContactUsButton
          text="Book A Call"
          className="max-w-full md:max-w-[50%]"
        />
      </AnimateOnScroll>

      {/* Right Content - BUG FIX: Using checkbox instead of radio so items can toggle independently */}
      <AnimateOnScroll
        delay={0.2}
        className="flex flex-col flex-1 divide-y divide-accent/30 border border-accent/30 border-l-8 rounded-lg overflow-hidden"
      >
        {data.map((e: any, i: number) => (
          <div
            key={"FAQ-" + i}
            className="collapse collapse-plus rounded-none bg-accent/5 hover:bg-accent/10 transition-colors"
          >
            {/* BUG FIX B3: checkbox instead of radio — allows individual toggle */}
            <input type="checkbox" defaultChecked={i === 0} />
            <div className="collapse-title text-lg font-medium">
              {e.title}
            </div>
            <div className="collapse-content">
              <p className="text-gray-500 leading-relaxed">{e.answer}</p>
            </div>
          </div>
        ))}
      </AnimateOnScroll>
    </Container>
  );
}
