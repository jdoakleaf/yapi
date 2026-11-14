/**
 * Blok tipi şemaları — güvenli, şemalı içerik sistemi.
 * Admin'e serbest HTML/JS çalıştırma yetkisi verilmez.
 * Her blok tipi için Zod şeması + TypeScript tipi tanımlanır.
 */

import { z } from "zod/v4";

// ---------------------------------------------------------------------------
// Ortak alt şemalar
// ---------------------------------------------------------------------------

const ButtonSchema = z.object({
  label: z.string().max(100).optional(),
  href: z.string().max(500).optional(),
  variant: z.enum(["primary", "secondary", "outline", "ghost"]).optional(),
});

// ---------------------------------------------------------------------------
// Blok şemaları
// ---------------------------------------------------------------------------

export const AnnouncementBarSchema = z.object({
  text: z.string().max(300),
  linkLabel: z.string().max(80).optional(),
  linkHref: z.string().max(500).optional(),
  bgColor: z.string().max(20).optional(),
  textColor: z.string().max(20).optional(),
});

export const HeroSchema = z.object({
  heading: z.string().max(200),
  subheading: z.string().max(400).optional(),
  primaryButton: ButtonSchema.optional(),
  secondaryButton: ButtonSchema.optional(),
  mediaId: z.string().uuid().optional(),
  overlayOpacity: z.number().min(0).max(100).optional(),
});

export const TrustIndicatorsSchema = z.object({
  heading: z.string().max(200).optional(),
  items: z.array(
    z.object({
      icon: z.string().max(50).optional(),
      label: z.string().max(100),
      value: z.string().max(100).optional(),
    })
  ).max(8),
});

export const ServicesGridSchema = z.object({
  heading: z.string().max(200).optional(),
  subheading: z.string().max(400).optional(),
  layout: z.enum(["grid", "list"]).optional(),
  maxItems: z.number().int().min(1).max(24).optional(),
  button: ButtonSchema.optional(),
});

export const ValuePropositionSchema = z.object({
  heading: z.string().max(200),
  subheading: z.string().max(400).optional(),
  items: z.array(
    z.object({
      icon: z.string().max(50).optional(),
      title: z.string().max(100),
      description: z.string().max(400),
    })
  ).max(6),
  bgDark: z.boolean().optional(),
});

export const FeaturedProjectsSchema = z.object({
  heading: z.string().max(200).optional(),
  subheading: z.string().max(400).optional(),
  maxItems: z.number().int().min(1).max(12).optional(),
  button: ButtonSchema.optional(),
});

export const WorkModelsSchema = z.object({
  heading: z.string().max(200).optional(),
  subheading: z.string().max(400).optional(),
  items: z.array(
    z.object({
      icon: z.string().max(50).optional(),
      title: z.string().max(100),
      description: z.string().max(500),
    })
  ).max(6),
});

export const ProcessStepsSchema = z.object({
  heading: z.string().max(200).optional(),
  subheading: z.string().max(400).optional(),
  steps: z.array(
    z.object({
      stepNumber: z.number().int().min(1).max(20),
      title: z.string().max(100),
      description: z.string().max(400),
    })
  ).max(10),
});

export const TestimonialsSchema = z.object({
  heading: z.string().max(200).optional(),
  maxItems: z.number().int().min(1).max(12).optional(),
  layout: z.enum(["carousel", "grid"]).optional(),
});

export const BlogPreviewSchema = z.object({
  heading: z.string().max(200).optional(),
  maxItems: z.number().int().min(1).max(6).optional(),
  button: ButtonSchema.optional(),
});

export const CtaBannerSchema = z.object({
  heading: z.string().max(200),
  subheading: z.string().max(400).optional(),
  primaryButton: ButtonSchema.optional(),
  secondaryButton: ButtonSchema.optional(),
  bgDark: z.boolean().optional(),
  phone: z.string().max(30).optional(),
});

export const RichTextSchema = z.object({
  content: z.string().max(50000),
});

// ---------------------------------------------------------------------------
// Blok tipi kayıt defteri
// ---------------------------------------------------------------------------

export const BLOCK_SCHEMAS = {
  announcement_bar: AnnouncementBarSchema,
  hero: HeroSchema,
  trust_indicators: TrustIndicatorsSchema,
  services_grid: ServicesGridSchema,
  value_proposition: ValuePropositionSchema,
  featured_projects: FeaturedProjectsSchema,
  work_models: WorkModelsSchema,
  process_steps: ProcessStepsSchema,
  testimonials: TestimonialsSchema,
  blog_preview: BlogPreviewSchema,
  cta_banner: CtaBannerSchema,
  rich_text: RichTextSchema,
} as const;

export type BlockType = keyof typeof BLOCK_SCHEMAS;

export const BLOCK_LABELS: Record<BlockType, string> = {
  announcement_bar: "Duyuru Bandı",
  hero: "Hero Alanı",
  trust_indicators: "Güven Göstergeleri",
  services_grid: "Hizmetler Izgarası",
  value_proposition: "Kurumsal Değer Önerisi",
  featured_projects: "Öne Çıkan Projeler",
  work_models: "Çalışma Modelleri",
  process_steps: "Çalışma Süreci",
  testimonials: "Müşteri Yorumları",
  blog_preview: "Blog Yazıları",
  cta_banner: "CTA Bandı",
  rich_text: "Zengin Metin",
};

/** Verilen blockType ve contentJson'ı doğrular */
export function validateBlockContent(
  blockType: string,
  contentJson: unknown
): { success: true; data: unknown } | { success: false; error: string } {
  if (!(blockType in BLOCK_SCHEMAS)) {
    return { success: false, error: `Bilinmeyen blok tipi: ${blockType}` };
  }
  const schema = BLOCK_SCHEMAS[blockType as BlockType];
  const result = schema.safeParse(contentJson);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((i) => i.message).join(", ") };
  }
  return { success: true, data: result.data };
}
