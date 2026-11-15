"use client";

/**
 * src/app/setup/setup-form.tsx
 * Kurulum sihirbazı form bileşeni — client component.
 */

import { useActionState } from "react";
import { setupAction } from "./actions";

export default function SetupForm() {
  const [state, formAction, isPending] = useActionState(
    setupAction,
    undefined
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb] px-4">
      <div className="w-full max-w-lg">
        {/* Logo / Başlık */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#101F33] text-white text-2xl font-bold mb-4 shadow-lg">
            Y
          </div>
          <h1 className="text-3xl font-bold text-[#101F33]">
            İlk Kurulum
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Platformu kullanmaya başlamak için birkaç bilgi girin.
          </p>
        </div>

        {/* Kart */}
        <div className="bg-white rounded-2xl shadow-md px-8 py-10">
          {/* Hata mesajı */}
          {state?.error && (
            <div
              role="alert"
              className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700"
            >
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            {/* ---- Site Bilgileri ---- */}
            <div>
              <h2 className="text-xs font-semibold text-[#1769AA] uppercase tracking-widest mb-4">
                Site Bilgileri
              </h2>
              <div>
                <label
                  htmlFor="siteName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Site / Firma Adı
                </label>
                <input
                  id="siteName"
                  name="siteName"
                  type="text"
                  required
                  disabled={isPending}
                  defaultValue=""
                  placeholder="Örn: ABC İnşaat"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:border-[#1769AA] disabled:opacity-50"
                />
              </div>
            </div>

            {/* ---- Admin Bilgileri ---- */}
            <div>
              <h2 className="text-xs font-semibold text-[#1769AA] uppercase tracking-widest mb-4">
                Yönetici Hesabı
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="adminName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ad Soyad
                  </label>
                  <input
                    id="adminName"
                    name="adminName"
                    type="text"
                    required
                    disabled={isPending}
                    defaultValue=""
                    placeholder="Örn: Ahmet Yılmaz"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:border-[#1769AA] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adminEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    E-posta
                  </label>
                  <input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    required
                    disabled={isPending}
                    defaultValue=""
                    placeholder="admin@firma.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:border-[#1769AA] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adminPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Parola{" "}
                    <span className="text-gray-400 font-normal">
                      (en az 12 karakter)
                    </span>
                  </label>
                  <input
                    id="adminPassword"
                    name="adminPassword"
                    type="password"
                    required
                    minLength={12}
                    disabled={isPending}
                    defaultValue=""
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:border-[#1769AA] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adminPasswordConfirm"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Parola Tekrar
                  </label>
                  <input
                    id="adminPasswordConfirm"
                    name="adminPasswordConfirm"
                    type="password"
                    required
                    minLength={12}
                    disabled={isPending}
                    defaultValue=""
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:border-[#1769AA] disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* ---- Gönder ---- */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-[#1769AA] hover:bg-[#125589] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Kurulum tamamlanıyor..." : "Kurulumu Tamamla →"}
            </button>
          </form>
        </div>

        {/* Alt not */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Bu sayfa yalnızca ilk kurulum için görünür. Kurulum tamamlandıktan
          sonra otomatik kapanır.
        </p>
      </div>
    </div>
  );
}
