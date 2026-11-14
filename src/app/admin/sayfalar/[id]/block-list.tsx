"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addPageSection,
  updatePageSection,
  deletePageSection,
  reorderPageSections,
  toggleSectionActive,
} from "@/lib/cms/page-actions";
import { BLOCK_LABELS, type BlockType } from "@/lib/cms/blocks";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Pencil,
  X,
  Check,
} from "lucide-react";

interface Section {
  id: string;
  blockType: string;
  sortOrder: number;
  isActive: boolean;
  contentJson: unknown;
}

interface BlockListProps {
  pageId: string;
  sections: Section[];
}

const AVAILABLE_BLOCKS: BlockType[] = [
  "announcement_bar",
  "hero",
  "trust_indicators",
  "services_grid",
  "value_proposition",
  "featured_projects",
  "work_models",
  "process_steps",
  "testimonials",
  "blog_preview",
  "cta_banner",
  "rich_text",
];

/** Basit JSON editörü — üretimde blok tipine özel form kullanılacak */
function BlockContentEditor({
  blockType,
  initialContent,
  onSave,
  onCancel,
  isPending,
}: {
  blockType: string;
  initialContent: unknown;
  onSave: (content: unknown) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [json, setJson] = useState(
    JSON.stringify(initialContent ?? {}, null, 2)
  );
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(json);
      setError(null);
      onSave(parsed);
    } catch {
      setError("Geçersiz JSON formatı.");
    }
  };

  return (
    <div className="mt-3 space-y-3 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4">
      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
        {BLOCK_LABELS[blockType as BlockType] ?? blockType} — İçerik
      </p>
      <textarea
        className="w-full rounded-md border border-[var(--border)] bg-white p-3 font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] min-h-[180px]"
        value={json}
        onChange={(e) => setJson(e.target.value)}
        disabled={isPending}
        spellCheck={false}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={isPending} className="gap-1.5">
          <Check className="h-3.5 w-3.5" />
          Kaydet
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} disabled={isPending} className="gap-1.5">
          <X className="h-3.5 w-3.5" />
          İptal
        </Button>
      </div>
    </div>
  );
}

export function BlockList({ pageId, sections: initialSections }: BlockListProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingBlock, setAddingBlock] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType>("hero");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const refresh = () => {
    router.refresh();
  };

  const handleToggleActive = (section: Section) => {
    startTransition(async () => {
      const result = await toggleSectionActive(section.id, !section.isActive);
      if (result.success) {
        setSections((prev) =>
          prev.map((s) => (s.id === section.id ? { ...s, isActive: !section.isActive } : s))
        );
      } else {
        toast({ title: "Hata", description: result.error, variant: "destructive" });
      }
    });
  };

  const handleDelete = (section: Section) => {
    if (!confirm(`"${BLOCK_LABELS[section.blockType as BlockType] ?? section.blockType}" bloğunu silmek istiyor musunuz?`)) return;
    startTransition(async () => {
      const result = await deletePageSection(section.id);
      if (result.success) {
        setSections((prev) => prev.filter((s) => s.id !== section.id));
        toast({ title: "Blok silindi" });
      } else {
        toast({ title: "Hata", description: result.error, variant: "destructive" });
      }
    });
  };

  const handleSaveContent = (sectionId: string, content: unknown) => {
    startTransition(async () => {
      const result = await updatePageSection(sectionId, content);
      if (result.success) {
        setSections((prev) =>
          prev.map((s) => (s.id === sectionId ? { ...s, contentJson: content } : s))
        );
        setEditingId(null);
        toast({ title: "Blok güncellendi" });
      } else {
        toast({ title: "Hata", description: result.error, variant: "destructive" });
      }
    });
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const newSections = [...sections];
    [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
    setSections(newSections);
    startTransition(async () => {
      const result = await reorderPageSections(pageId, newSections.map((s) => s.id));
      if (!result.success) {
        toast({ title: "Hata", description: result.error, variant: "destructive" });
        setSections(sections);
      }
    });
  };

  const handleMoveDown = (idx: number) => {
    if (idx === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
    setSections(newSections);
    startTransition(async () => {
      const result = await reorderPageSections(pageId, newSections.map((s) => s.id));
      if (!result.success) {
        toast({ title: "Hata", description: result.error, variant: "destructive" });
        setSections(sections);
      }
    });
  };

  const handleAddBlock = () => {
    const defaults: Record<string, unknown> = {
      hero: { heading: "Başlık", subheading: "Alt başlık" },
      cta_banner: { heading: "Hemen Teklif Alın" },
      trust_indicators: { items: [{ label: "Deneyim", value: "10+ Yıl" }] },
      services_grid: { heading: "Hizmetlerimiz" },
      value_proposition: { heading: "Neden Biz?", items: [] },
      featured_projects: { heading: "Projelerimiz" },
      work_models: { heading: "Çalışma Modellerimiz", items: [] },
      process_steps: { heading: "Çalışma Sürecimiz", steps: [] },
      testimonials: { heading: "Müşteri Yorumları" },
      blog_preview: { heading: "Blog" },
      announcement_bar: { text: "Ücretsiz keşif için hemen arayın!" },
      rich_text: { content: "<p>İçerik buraya...</p>" },
    };

    startTransition(async () => {
      const result = await addPageSection(
        pageId,
        selectedBlockType,
        defaults[selectedBlockType] ?? {}
      );
      if (result.success) {
        setAddingBlock(false);
        toast({ title: "Blok eklendi" });
        refresh();
      } else {
        toast({ title: "Hata", description: result.error, variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-3">
      {sections.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--text-muted)]">
          Bu sayfada henüz blok yok. Aşağıdan ekleyin.
        </p>
      )}

      {sections.map((section, idx) => (
        <div
          key={section.id}
          className={`rounded-lg border transition-colors ${
            section.isActive
              ? "border-[var(--border)] bg-white"
              : "border-dashed border-[var(--border)] bg-[var(--surface-muted)] opacity-60"
          }`}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            {/* Sıralama */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => handleMoveUp(idx)}
                disabled={idx === 0 || isPending}
                className="rounded p-0.5 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] disabled:opacity-30"
                title="Yukarı taşı"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleMoveDown(idx)}
                disabled={idx === sections.length - 1 || isPending}
                className="rounded p-0.5 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] disabled:opacity-30"
                title="Aşağı taşı"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Blok bilgisi */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {BLOCK_LABELS[section.blockType as BlockType] ?? section.blockType}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {section.blockType} · sıra: {section.sortOrder + 1}
              </p>
            </div>

            {/* Eylemler */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToggleActive(section)}
                disabled={isPending}
                title={section.isActive ? "Pasif yap" : "Aktif yap"}
                className="text-[var(--text-muted)]"
              >
                {section.isActive ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingId(editingId === section.id ? null : section.id)}
                disabled={isPending}
                title="İçeriği düzenle"
                className={editingId === section.id ? "bg-[var(--brand-soft)] text-[var(--brand-primary)]" : "text-[var(--text-muted)]"}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(section)}
                disabled={isPending}
                title="Sil"
                className="text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* İçerik editörü */}
          {editingId === section.id && (
            <div className="border-t border-[var(--border)] px-4 pb-4">
              <BlockContentEditor
                blockType={section.blockType}
                initialContent={section.contentJson}
                onSave={(content) => handleSaveContent(section.id, content)}
                onCancel={() => setEditingId(null)}
                isPending={isPending}
              />
            </div>
          )}
        </div>
      ))}

      <Separator />

      {/* Blok ekleme */}
      {addingBlock ? (
        <div className="rounded-lg border border-[var(--brand-primary)] bg-[var(--brand-soft)] p-4 space-y-3">
          <p className="text-sm font-medium text-[var(--brand-primary)]">Blok Tipi Seçin</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_BLOCKS.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedBlockType(type)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedBlockType === type
                    ? "bg-[var(--brand-primary)] text-white"
                    : "bg-white text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--brand-primary)]"
                }`}
              >
                {BLOCK_LABELS[type]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddBlock} disabled={isPending} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Ekle
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAddingBlock(false)} disabled={isPending}>
              İptal
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full gap-2 border-dashed"
          onClick={() => setAddingBlock(true)}
          disabled={isPending}
        >
          <Plus className="h-4 w-4" />
          Blok Ekle
        </Button>
      )}
    </div>
  );
}
