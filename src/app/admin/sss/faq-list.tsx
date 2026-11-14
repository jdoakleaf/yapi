"use client";

import { useState, useTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFAQ, updateFAQ, deleteFAQ, toggleFAQPublished } from "@/lib/cms/content-actions";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  serviceId: string | null;
  sortOrder: number;
  isPublished: boolean;
  service: { id: string; title: string } | null;
}

interface Service { id: string; title: string }

interface Props {
  faqs: FAQ[];
  services: Service[];
}

type FormState = { success?: boolean; errors?: Record<string, string[]> } | null;

function FAQForm({
  faq,
  services,
  onDone,
}: {
  faq?: FAQ;
  services: Service[];
  onDone: () => void;
}) {
  const router = useRouter();

  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    if (faq) {
      const result = await updateFAQ(faq.id, formData);
      if (result.success) { router.refresh(); onDone(); }
      return result;
    } else {
      const result = await createFAQ(formData);
      if (result.success) { router.refresh(); onDone(); }
      return result;
    }
  }

  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="space-y-2">
        <Label htmlFor="question">Soru *</Label>
        <Input id="question" name="question" defaultValue={faq?.question ?? ""} required placeholder="Sık sorulan soru..." />
        {state?.errors?.question && <p className="text-sm text-red-600">{state.errors.question[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="answer">Yanıt *</Label>
        <textarea id="answer" name="answer" defaultValue={faq?.answer ?? ""} rows={4} required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Yanıt..." />
        {state?.errors?.answer && <p className="text-sm text-red-600">{state.errors.answer[0]}</p>}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="serviceId">İlgili Hizmet</Label>
          <select id="serviceId" name="serviceId" defaultValue={faq?.serviceId ?? ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Genel (hizmetsiz)</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sıra</Label>
          <Input id="sortOrder" name="sortOrder" type="number" min="0" defaultValue={String(faq?.sortOrder ?? 0)} />
        </div>
        <div className="flex items-end gap-2 pb-0.5">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isPublished" value="true" defaultChecked={faq?.isPublished ?? false}
              onChange={(e) => { const h = document.getElementById(`isPublishedH_${faq?.id ?? "new"}`) as HTMLInputElement; if (h) h.value = e.target.checked ? "true" : "false"; }}
              className="h-4 w-4 rounded" />
            <input type="hidden" id={`isPublishedH_${faq?.id ?? "new"}`} name="isPublished" value={faq?.isPublished ? "true" : "false"} />
            Yayınla
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>{isPending ? "Kaydediliyor..." : faq ? "Güncelle" : "Ekle"}</Button>
        <Button type="button" size="sm" variant="outline" onClick={onDone}>İptal</Button>
      </div>
    </form>
  );
}

export function FAQList({ faqs, services }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete(id: string) {
    if (!confirm("Bu soruyu silmek istediğinizden emin misiniz?")) return;
    startTransition(async () => { await deleteFAQ(id); router.refresh(); });
  }

  function handleToggle(id: string) {
    startTransition(async () => { await toggleFAQPublished(id); router.refresh(); });
  }

  return (
    <div className="space-y-4">
      {!showForm && editId === null && (
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />Yeni Soru Ekle
        </Button>
      )}

      {showForm && (
        <FAQForm services={services} onDone={() => setShowForm(false)} />
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {faqs.length === 0 && (
          <p className="p-8 text-center text-gray-400">Henüz SSS yok.</p>
        )}
        {faqs.map((faq) => (
          <div key={faq.id} className="border-b border-gray-100 last:border-0">
            {editId === faq.id ? (
              <div className="p-4">
                <FAQForm faq={faq} services={services} onDone={() => setEditId(null)} />
              </div>
            ) : (
              <div className="flex items-start gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{faq.question}</p>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{faq.answer}</p>
                  {faq.service && (
                    <span className="mt-1 inline-block rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                      {faq.service.title}
                    </span>
                  )}
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${faq.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {faq.isPublished ? "Yayında" : "Taslak"}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => handleToggle(faq.id)} disabled={isPending}>
                    {faq.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditId(faq.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(faq.id)} disabled={isPending}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
