"use client";

import { useActionState, useState } from "react";
import { createLead } from "@/lib/leads/lead-actions";
import { CustomerType, WorkModel } from "@prisma/client";

interface Service {
  id: string;
  title: string;
}

interface LeadFormProps {
  services: Service[];
}

const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  INDIVIDUAL: "Bireysel",
  CORPORATE: "Kurumsal",
};

const WORK_MODEL_LABELS: Record<WorkModel, string> = {
  LABOR_ONLY: "Sadece İşçilik",
  MATERIAL_AND_LABOR: "Malzeme + İşçilik",
  TURNKEY: "Anahtar Teslim",
  UNDECIDED: "Henüz Karar Vermedim",
};

type FormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; referenceCode: string };

async function submitLead(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await createLead(formData);
  if (result.success) {
    return { status: "success", referenceCode: result.referenceCode! };
  }
  return { status: "error", message: result.error ?? "Bir hata oluştu" };
}

export function LeadForm({ services }: LeadFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitLead,
    { status: "idle" },
  );
  const [kvkk, setKvkk] = useState(false);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-4 text-5xl">✅</div>
        <h2 className="mb-2 text-2xl font-bold text-green-800">
          Talebiniz Alındı!
        </h2>
        <p className="mb-4 text-green-700">
          En kısa sürede sizinle iletişime geçeceğiz.
        </p>
        <div className="inline-block rounded-lg bg-white px-6 py-3 shadow-sm">
          <p className="text-sm text-gray-500">Referans Kodunuz</p>
          <p className="font-mono text-xl font-bold text-blue-700">
            {state.referenceCode}
          </p>
        </div>
        <p className="mt-4 text-sm text-green-600">
          Bu kodu not alın. Talebinizi sorgularken kullanabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="sourcePage" value="/teklif-al" />

      {state.status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      {/* Kişisel Bilgiler */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h3 className="mb-4 font-semibold text-gray-800">İletişim Bilgileri</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              minLength={2}
              placeholder="Ahmet Yılmaz"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Telefon <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="0532 000 00 00"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="customerType"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Müşteri Tipi <span className="text-red-500">*</span>
            </label>
            <select
              id="customerType"
              name="customerType"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {Object.entries(CUSTOMER_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Proje Detayları */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h3 className="mb-4 font-semibold text-gray-800">Proje Detayları</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="serviceId"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              İlgilendiğiniz Hizmet
            </label>
            <select
              id="serviceId"
              name="serviceId"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">— Seçiniz —</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="workModel"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Çalışma Modeli <span className="text-red-500">*</span>
            </label>
            <select
              id="workModel"
              name="workModel"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {Object.entries(WORK_MODEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="city"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              İl <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              placeholder="İstanbul"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="district"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              İlçe
            </label>
            <input
              id="district"
              name="district"
              type="text"
              placeholder="Kadıköy"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Mesajınız
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={2000}
            placeholder="Projeniz hakkında kısa bilgi verin..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* KVKK */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="kvkkConsent"
            value="true"
            checked={kvkk}
            onChange={(e) => setKvkk(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600"
            required
          />
          <span className="text-sm text-gray-700">
            Kişisel verilerimin işlenmesine ilişkin{" "}
            <a
              href="/kvkk"
              target="_blank"
              className="text-blue-600 underline hover:text-blue-800"
            >
              KVKK Aydınlatma Metni
            </a>
            &apos;ni okudum ve kabul ediyorum.{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending || !kvkk}
        className="w-full rounded-xl bg-blue-700 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Gönderiliyor..." : "Teklif İste"}
      </button>
    </form>
  );
}
