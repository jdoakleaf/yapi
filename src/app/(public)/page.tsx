export const instant = false;

import { getPublicSiteSettings, getSetting } from "@/lib/settings/site-data";
import { HeroSection } from "@/components/public/hero-section";
import { TrustIndicators } from "@/components/public/trust-indicators";
import { ServicesSection } from "@/components/public/services-section";
import { ValuePropositionSection } from "@/components/public/value-proposition-section";
import { ProjectsSection } from "@/components/public/projects-section";
import { ProcessSection } from "@/components/public/process-section";
import { TestimonialsSection } from "@/components/public/testimonials-section";
import { CTASection } from "@/components/public/cta-section";
import { OrganizationSchema, BreadcrumbSchema } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const siteName = getSetting(settings, "site_name", "Yapı Platform");
  const description = getSetting(
    settings,
    "site_description",
    "İzmir merkezli profesyonel yapı, inşaat ve uygulama hizmetleri. 12 farklı hizmet kategorisinde kaliteli ve güvenilir çözümler.",
  );
  return {
    title: siteName,
    description,
    openGraph: {
      title: siteName,
      description,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const settings = await getPublicSiteSettings();
  const phone = getSetting(settings, "contact_phone");
  const siteName = getSetting(settings, "site_name", "Yapı Platform");
  const description = getSetting(
    settings,
    "site_description",
    "İzmir merkezli profesyonel yapı, inşaat ve uygulama hizmetleri.",
  );
  const email = getSetting(settings, "contact_email");
  const address = getSetting(settings, "contact_address");

  const socialUrls: string[] = [];
  const fb = getSetting(settings, "social_facebook");
  const ig = getSetting(settings, "social_instagram");
  const li = getSetting(settings, "social_linkedin");
  if (fb) socialUrls.push(fb);
  if (ig) socialUrls.push(ig);
  if (li) socialUrls.push(li);

  return (
    <>
      <OrganizationSchema
        name={siteName}
        phone={phone || undefined}
        email={email || undefined}
        address={address || undefined}
        description={description}
        socialUrls={socialUrls}
      />
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", href: "/" }]} />
      <HeroSection />
      <TrustIndicators />
      <ServicesSection />
      <ValuePropositionSection />
      <ProjectsSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection phone={phone || undefined} />
    </>
  );
}
