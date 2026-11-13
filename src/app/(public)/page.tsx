import Link from "next/link";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-[#101F33] sm:text-5xl">
        Yapı, İnşaat ve Uygulama Platformu
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600">
        İzmir merkezli profesyonel yapı ve inşaat hizmetleri. 12 farklı hizmet
        kategorisinde kaliteli ve güvenilir çözümler.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/teklif-al"
          className="rounded-lg bg-[#1769AA] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2589D8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769AA]"
        >
          Teklif Al
        </Link>
        <Link
          href="/hizmetler"
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Hizmetlerimiz
        </Link>
      </div>
    </section>
  );
}
