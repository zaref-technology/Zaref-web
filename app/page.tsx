import { ArrowRight } from 'lucide-react';
import Hero from '@/components/Hero';
import CredibilityStrip from '@/components/CredibilityStrip';
import ServicesSection from '@/components/ServicesSection';
import BusinessSoftwareSection from '@/components/BusinessSoftwareSection';
import ProjectsSection from '@/components/ProjectsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ApproachSection from '@/components/ApproachSection';
import PartnershipSection from '@/components/PartnershipSection';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

// Timed ISR fallback — admin edits go live immediately via on-demand revalidation
// (see lib/revalidate.ts), this is just a ceiling in case that ever gets missed.
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <Hero />

      <CredibilityStrip />

      <ServicesSection />

      <BusinessSoftwareSection />

      {/* Projects — live from Firestore, curated subset (featured presentation) */}
      <ProjectsSection variant="featured" />

      <ApproachSection />

      <PartnershipSection />

      {/* Testimonials — live from Firestore, adaptive layout */}
      <TestimonialsSection />

      {/* Final CTA — deliberately dark, hardcoded colors so it reads the same in both themes */}
      <section className="bg-[#0b1018] py-20 md:py-24">
        <Container>
          <div className="mx-auto max-w-[600px] text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-white">
              Have a software challenge worth solving?
            </h2>
            <p className="mx-auto mb-8 text-[1.05rem] leading-[1.6] text-white/60">
              Tell us what you&apos;re building or where your business is getting stuck. We&apos;ll help you determine the right technical approach.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/contact">
                Discuss Your Project <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
