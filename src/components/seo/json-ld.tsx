/**
 * JSON-LD yapılandırılmış veri bileşenleri.
 * Google Search, Schema.org standartları.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ---------------------------------------------------------------------------
// Organization schema — Ana sayfa ve site geneli
// ---------------------------------------------------------------------------

interface OrganizationSchemaProps {
  name: string;
  url?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  socialUrls?: string[];
}

export function OrganizationSchema({
  name,
  url = BASE_URL,
  phone,
  email,
  address,
  description,
  logoUrl,
  socialUrls = [],
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    url,
    ...(description && { description }),
    ...(logoUrl && { logo: logoUrl }),
    ...(phone && {
      telephone: phone,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: phone,
        contactType: "customer service",
        availableLanguage: "Turkish",
      },
    }),
    ...(email && { email }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        addressLocality: "İzmir",
        addressCountry: "TR",
        streetAddress: address,
      },
    }),
    ...(socialUrls.length > 0 && { sameAs: socialUrls }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// BreadcrumbList schema
// ---------------------------------------------------------------------------

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${BASE_URL}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Article / BlogPost schema
// ---------------------------------------------------------------------------

interface ArticleSchemaProps {
  title: string;
  description?: string;
  slug: string;
  publishedAt?: Date | null;
  updatedAt?: Date;
  imageUrl?: string;
  authorName?: string;
}

export function ArticleSchema({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  imageUrl,
  authorName,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    ...(description && { description }),
    url: `${BASE_URL}/blog/${slug}`,
    ...(publishedAt && { datePublished: publishedAt.toISOString() }),
    ...(updatedAt && { dateModified: updatedAt.toISOString() }),
    ...(imageUrl && { image: imageUrl }),
    ...(authorName && {
      author: { "@type": "Person", name: authorName },
    }),
    publisher: {
      "@type": "Organization",
      name: "Yapı Platform",
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Service schema
// ---------------------------------------------------------------------------

interface ServiceSchemaProps {
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
}

export function ServiceSchema({
  name,
  description,
  slug,
  imageUrl,
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    ...(description && { description }),
    url: `${BASE_URL}/hizmetler/${slug}`,
    ...(imageUrl && { image: imageUrl }),
    provider: {
      "@type": "LocalBusiness",
      name: "Yapı Platform",
      url: BASE_URL,
    },
    areaServed: {
      "@type": "City",
      name: "İzmir",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// FAQPage schema
// ---------------------------------------------------------------------------

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  if (items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
