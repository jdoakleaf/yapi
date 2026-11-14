export const instant = false;

import { getPublicSiteSettings, getSetting } from "@/lib/settings/site-data";
import { AnnouncementBar } from "@/components/public/announcement-bar";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSiteSettings();

  const siteName = getSetting(settings, "site_name", "Yapı Platform");
  const tagline = getSetting(settings, "site_tagline");
  const phone = getSetting(settings, "contact_phone");
  const email = getSetting(settings, "contact_email");
  const address = getSetting(settings, "contact_address");
  const workingHours = getSetting(settings, "working_hours");
  const announcementText = getSetting(settings, "announcement_text");
  const announcementLink = getSetting(settings, "announcement_link");
  const announcementActive =
    getSetting(settings, "announcement_active") === "true";
  const socialFacebook = getSetting(settings, "social_facebook");
  const socialInstagram = getSetting(settings, "social_instagram");
  const socialLinkedin = getSetting(settings, "social_linkedin");
  const socialYoutube = getSetting(settings, "social_youtube");

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar
        text={announcementText}
        link={announcementLink}
        active={announcementActive}
      />
      <SiteHeader siteName={siteName} phone={phone || undefined} />

      <main className="flex-1">{children}</main>

      <SiteFooter
        siteName={siteName}
        tagline={tagline || undefined}
        phone={phone || undefined}
        email={email || undefined}
        address={address || undefined}
        workingHours={workingHours || undefined}
        socialFacebook={socialFacebook || undefined}
        socialInstagram={socialInstagram || undefined}
        socialLinkedin={socialLinkedin || undefined}
        socialYoutube={socialYoutube || undefined}
      />
    </div>
  );
}
