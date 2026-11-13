import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-[#101F33]">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Sayfa Bulunamadı
      </h2>
      <p className="mt-2 max-w-md text-gray-600">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-[#1769AA] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2589D8]"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
