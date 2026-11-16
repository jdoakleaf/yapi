
import Link from "next/link";
import { getLeads } from "@/lib/leads/lead-actions";
import { LeadStatus } from "@prisma/client";

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

type LeadRow = {
  id: string;
  referenceCode: string;
  fullName: string;
  phone: string;
  city: string;
  status: LeadStatus;
  createdAt: Date;
  service: { title: string } | null;
};

interface PageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function TaleplerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status as LeadStatus | undefined;
  const search = params.search;
  const page = params.page ? parseInt(params.page) : 1;
  const startDate = params.startDate;
  const endDate = params.endDate;

  const { leads, total, pageCount } = await getLeads({
    status,
    search,
    page,
    startDate,
    endDate,
  });

  function buildUrl(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const merged = { status, search, page: String(page), startDate, endDate, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "undefined") p.set(k, v);
    }
    return `/admin/talepler?${p.toString()}`;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talepler</h1>
          <p className="text-sm text-gray-500">{total} talep</p>
        </div>
      </div>

      {/* Filtreler */}
      <div className="mb-6 flex flex-wrap gap-3">
        {/* Durum filtresi */}
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={buildUrl({ status: undefined, page: "1" })}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${!status ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Tümü
          </Link>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <Link
              key={value}
              href={buildUrl({ status: value, page: "1" })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${status === value ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Arama */}
      <form method="GET" action="/admin/talepler" className="mb-6 flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Referans kodu, isim veya telefon..."
          className="w-72 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <input type="text" name="startDate" defaultValue={startDate} placeholder="Başlangıç (YYYY-MM-DD)" className="w-44 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        <input type="text" name="endDate" defaultValue={endDate} placeholder="Bitiş (YYYY-MM-DD)" className="w-44 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        <button
          type="submit"
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Ara
        </button>
        {(search || startDate || endDate) && (
          <Link
            href={buildUrl({ search: undefined, startDate: undefined, endDate: undefined, page: "1" })}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Temizle
          </Link>
        )}
      </form>

      {/* Tablo */}
      {leads.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-gray-500">
          Talep bulunamadı.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Ref. Kodu
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Ad Soyad
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Telefon
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Hizmet
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  İl
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Durum
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Tarih
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(leads as LeadRow[]).map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-blue-700">
                    {lead.referenceCode}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {lead.fullName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lead.phone}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {lead.service?.title ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lead.city}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[lead.status]}`}
                    >
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/talepler/${lead.id}`}
                      className="font-medium text-blue-700 hover:underline"
                    >
                      Detay
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sayfalama */}
      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildUrl({ page: String(page - 1) })}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              ← Önceki
            </Link>
          )}
          <span className="text-sm text-gray-600">
            {page} / {pageCount}
          </span>
          {page < pageCount && (
            <Link
              href={buildUrl({ page: String(page + 1) })}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Sonraki →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
