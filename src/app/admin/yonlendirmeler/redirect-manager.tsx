"use client";

import { useActionState } from "react";
import { createRedirect, deleteRedirect, toggleRedirect } from "./redirect-actions";
import type { RedirectFormState } from "./redirect-actions";

const initialState: RedirectFormState = { success: false };

type Redirect = {
  id: string;
  sourcePath: string;
  destinationPath: string;
  httpStatus: "REDIRECT_301" | "REDIRECT_302";
  isActive: boolean;
  createdAt: Date;
};

export function RedirectManager({ redirects }: { redirects: Redirect[] }) {
  const [state, formAction, pending] = useActionState(createRedirect, initialState);

  async function handleDelete(id: string) {
    if (!confirm("Bu yönlendirmeyi silmek istediğinizden emin misiniz?")) return;
    await deleteRedirect(id);
  }

  async function handleToggle(id: string, current: boolean) {
    await toggleRedirect(id, !current);
  }

  return (
    <div className="space-y-8">
      {/* Yeni yönlendirme formu */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Yeni Yönlendirme Ekle</h2>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Kaynak Yol <span className="text-red-500">*</span>
            </label>
            <input
              name="sourcePath"
              type="text"
              placeholder="/eski-sayfa"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            {state.fieldErrors?.sourcePath && (
              <p className="mt-1 text-xs text-red-600">{state.fieldErrors.sourcePath[0]}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Hedef Yol <span className="text-red-500">*</span>
            </label>
            <input
              name="destinationPath"
              type="text"
              placeholder="/yeni-sayfa"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            {state.fieldErrors?.destinationPath && (
              <p className="mt-1 text-xs text-red-600">{state.fieldErrors.destinationPath[0]}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Durum Kodu</label>
            <select
              name="httpStatus"
              defaultValue="REDIRECT_301"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="REDIRECT_301">301 — Kalıcı</option>
              <option value="REDIRECT_302">302 — Geçici</option>
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input name="isActive" type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" />
              Aktif
            </label>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {pending ? "Ekleniyor…" : "Ekle"}
            </button>
          </div>
        </form>
        {state.error && (
          <p className="mt-3 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</p>
        )}
        {state.success && (
          <p className="mt-3 rounded-md bg-green-50 px-4 py-2 text-sm text-green-700">
            Yönlendirme başarıyla eklendi.
          </p>
        )}
      </div>

      {/* Mevcut yönlendirmeler */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Mevcut Yönlendirmeler ({redirects.length})
          </h2>
        </div>
        {redirects.length === 0 ? (
          <p className="px-6 py-10 text-center text-gray-400">
            Henüz yönlendirme tanımlanmamış.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Kaynak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hedef
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Kod
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {redirects.map((r) => (
                  <tr key={r.id} className={!r.isActive ? "opacity-50" : ""}>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">{r.sourcePath}</td>
                    <td className="px-6 py-4 font-mono text-sm text-blue-700">{r.destinationPath}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          r.httpStatus === "REDIRECT_301"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {r.httpStatus === "REDIRECT_301" ? "301" : "302"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          r.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {r.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggle(r.id, r.isActive)}
                          className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        >
                          {r.isActive ? "Pasifleştir" : "Aktifleştir"}
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
