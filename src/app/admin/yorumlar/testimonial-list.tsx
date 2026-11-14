"use client";

import { useState, useTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTestimonial, updateTestimonial, deleteTestimonial, toggleTestimonialPublished } from "@/lib/cms/content-actions";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";

interface Testimonial {
  id: string;
  displayName: string;
  companyOrLocation: string | null;
  quote: string;
  rating: number | null;
  sortOrder: number;
  isPublished: boolean;
  media: { storageKey: string; altText: string | null } | null;
}

type FormState = { success?: boolean; errors?: Record<string, string[]> } | null;

function TestimonialForm({ t, onDone }: { t?: Testimonial; onDone: () => void }) {
  const router = useRouter();
  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    if (t) {
      const result = await updateTestimonial(t.id, formData);
      if (result.success) { router.refresh(); onDone(); }
      return result;
    } else {
      const result = await createTestimonial(formData);
      if (result.success) { router.refresh(); onDone(); }
      return result;
    }
  }
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">İsim *</Label>
          <Input id="displayName" name="displayName" defaultValue={t?.displayName ?? ""} required />
          {state?.errors?.displayName && <p className="text-sm text-red-600">{state.errors.displayName[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyOrLocation">Şirket / Lokasyon</Label>
          <Input id="companyOrLocation" name="companyOrLocation" defaultValue={t?.companyOrLocation ?? ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="quote">Yorum *</Label>
        <textarea id="quote" name="quote" defaultValue={t?.quote ?? ""} rows={3} required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        {state?.errors?.quote && <p className="text-sm text-red-600">{state.errors.quote[0]}</p>}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="rating">Puan (1-5)</Label>
          <Input id="rating" name="rating" type="number" min="1" max="5" defaultValue={String(t?.rating ?? "")} placeholder="—" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sıra</Label>
          <Input id="sortOrder" name="sortOrder" type="number" min="0" defaultValue={String(t?.sortOrder ?? 0)} />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isPublished" value="true" defaultChecked={t?.isPublished ?? false}
              onChange={(e) => { const h = document.getElementById(`tIsP_${t?.id ?? "new"}`) as HTMLInputElement; if (h) h.value = e.target.checked ? "true" : "false"; }}
              className="h-4 w-4 rounded" />
            <input type="hidden" id={`tIsP_${t?.id ?? "new"}`} name="isPublished" value={t?.isPublished ? "true" : "false"} />
            Yayınla
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>{isPending ? "Kaydediliyor..." : t ? "Güncelle" : "Ekle"}</Button>
        <Button type="button" size="sm" variant="outline" onClick={onDone}>İptal</Button>
      </div>
    </form>
  );
}

export function TestimonialList({ testimonials }: { testimonials: Testimonial[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete(id: string) {
    if (!confirm("Bu yorumu silmek istiyor musunuz?")) return;
    startTransition(async () => { await deleteTestimonial(id); router.refresh(); });
  }

  function handleToggle(id: string) {
    startTransition(async () => { await toggleTestimonialPublished(id); router.refresh(); });
  }

  return (
    <div className="space-y-4">
      {!showForm && editId === null && (
        <Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" />Yeni Yorum Ekle</Button>
      )}
      {showForm && <TestimonialForm onDone={() => setShowForm(false)} />}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {testimonials.length === 0 && <p className="p-8 text-center text-gray-400">Henüz yorum yok.</p>}
        {testimonials.map((t) => (
          <div key={t.id} className="border-b border-gray-100 last:border-0">
            {editId === t.id ? (
              <div className="p-4"><TestimonialForm t={t} onDone={() => setEditId(null)} /></div>
            ) : (
              <div className="flex items-start gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{t.displayName}</p>
                    {t.companyOrLocation && <span className="text-sm text-gray-400">· {t.companyOrLocation}</span>}
                    {t.rating && (
                      <span className="flex items-center gap-0.5 text-xs text-yellow-500">
                        <Star className="h-3 w-3 fill-yellow-400" />{t.rating}/5
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">&quot;{t.quote}&quot;</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {t.isPublished ? "Yayında" : "Gizli"}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => handleToggle(t.id)} disabled={isPending}>
                    {t.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditId(t.id)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)} disabled={isPending}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
