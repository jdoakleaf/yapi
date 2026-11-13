"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
        <h1 className="text-4xl font-bold text-red-600">Bir Hata Oluştu</h1>
        <p className="mt-4 max-w-md text-gray-600">
          Beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin.
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <pre className="mt-4 max-w-2xl overflow-auto rounded-lg bg-gray-100 p-4 text-left text-sm text-gray-800">
            {error.message}
          </pre>
        )}
        <button
          onClick={reset}
          className="mt-8 rounded-lg bg-[#1769AA] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2589D8]"
        >
          Tekrar Dene
        </button>
      </body>
    </html>
  );
}
