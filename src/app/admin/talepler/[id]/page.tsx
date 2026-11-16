
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead } from "@/lib/leads/lead-actions";
import { StatusChanger } from "./status-changer";
import { NoteAdder } from "./note-adder";
import { LeadStatus, CustomerType, WorkModel } from "@prisma/client";

type LeadDetail = NonNullable<Awaited<ReturnType<typeof getLead>>>;

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Yeni",
  CONTACTED: "İletişime Geçildi",
  QUOTING: "Teklif Hazırlanıyor",
  QUOTE_SENT: "Teklif Gönderildi",
  WON: "Kazanıldı",
  LOST: "Kaybedildi",
  ARCHIVED: "Arşivlendi",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-yellow-100 text-yellow-800",
  QUOTING: "bg-purple-100 text-purple-800",
  QUOTE_SENT: "bg-indigo-100 text-indigo-800",
  WON: "bg-green-100 text-green-800",
  LOST: "bg-red-100 text-red-800",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TalepDetayPage({ params }: PageProps) {
  const { id } = await params;
  const leadRaw = await getLead(id);

  if (!leadRaw) notFound();

  const lead = leadRaw as LeadDetail;

  const consentMeta =
    lead.consentMetadata && typeof lead.consentMetadata === "object"
      ? (lead.consentMetadata as Record<string, string>)
      : null;

  return (
    <div className="p-6">
      {/* Üst bar */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/talepler"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Talepler
        </Link>
        <span className="text-gray-300">/</span>
        <span className="font-mono text-sm text-blue-700">
          {lead.referenceCode}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{lead.fullName}</h1>
          <p className="text-sm text-gray-500">
            {new Date(lead.createdAt).toLocaleString("tr-TR")} tarihinde oluşturuldu
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[lead.status]}`}
        >
          {STATUS_LABELS[lead.status]}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sol: Bilgiler */}
        <div className="space-y-6 lg:col-span-2">
          {/* Talep Bilgileri */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-gray-800">Talep Bilgileri</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Referans Kodu
                </dt>
                <dd className="font-mono text-sm font-semibold text-blue-700">
                  {lead.referenceCode}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Müşteri Tipi
                </dt>
                <dd className="text-sm text-gray-800">
                  {CUSTOMER_TYPE_LABELS[lead.customerType]}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Telefon
                </dt>
                <dd className="text-sm text-gray-800">
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-blue-700 hover:underline"
                  >
                    {lead.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  E-posta
                </dt>
                <dd className="text-sm text-gray-800">
                  {lead.email ? (
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-blue-700 hover:underline"
                    >
                      {lead.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  İl / İlçe
                </dt>
                <dd className="text-sm text-gray-800">
                  {lead.city}
                  {lead.district ? ` / ${lead.district}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Hizmet
                </dt>
                <dd className="text-sm text-gray-800">
                  {lead.service?.title ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Çalışma Modeli
                </dt>
                <dd className="text-sm text-gray-800">
                  {WORK_MODEL_LABELS[lead.workModel]}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Kaynak Sayfa
                </dt>
                <dd className="text-sm text-gray-800">
                  {lead.sourcePage ?? "—"}
                </dd>
              </div>
            </dl>

            {lead.message && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Mesaj
                </p>
                <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-800 whitespace-pre-wrap">
                  {lead.message}
                </p>
              </div>
            )}
          </div>

          {/* Notlar */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-gray-800">Notlar</h2>

            {lead.notes.length === 0 ? (
              <p className="mb-4 text-sm text-gray-500">Henüz not eklenmedi.</p>
            ) : (
              <div className="mb-4 space-y-3">
                {lead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">
                        {note.user.name ?? note.user.email}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(note.createdAt).toLocaleString("tr-TR")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {note.note}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 pt-4">
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                Not Ekle
              </h3>
              <NoteAdder leadId={lead.id} />
            </div>
          </div>
        </div>

        {/* Sağ: İşlemler */}
        <div className="space-y-6">
          {/* Durum Yönetimi */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-gray-800">Durum</h2>
            <StatusChanger leadId={lead.id} currentStatus={lead.status} />
          </div>

          {/* KVKK Bilgisi */}
          {lead.privacyNoticeVersion && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-3 font-semibold text-gray-800">KVKK</h2>
              <div className="space-y-1 text-xs text-gray-500">
                <p>
                  <span className="font-medium">Metin Sürümü:</span>{" "}
                  {lead.privacyNoticeVersion}
                </p>
                {consentMeta?.consentedAt && (
                  <p>
                    <span className="font-medium">Onay Tarihi:</span>{" "}
                    {new Date(consentMeta.consentedAt).toLocaleString("tr-TR")}
                  </p>
                )}
                {consentMeta?.ip && (
                  <p>
                    <span className="font-medium">IP:</span> {consentMeta.ip}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
