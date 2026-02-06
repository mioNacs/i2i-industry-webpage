import { ContactUsButton } from "@/components/forms/contact-form";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gray-800 py-20 px-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <AnimateOnScroll>
          <h3 className="text-3xl md:text-4xl font-bold text-white max-w-2xl">
            Helping you build a
            <span className="text-accent ml-1"> successful career path</span>.
            <br /> Get a head start with us.
          </h3>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.2}>
          <ContactUsButton
            className="mt-12 min-w-[200px]"
            text="Book a call"
          />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
