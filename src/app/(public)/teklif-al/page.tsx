export const instant = false;

import { prisma } from "@/lib/db";
import { ContentStatus } from "@prisma/client";
import { LeadForm } from "./lead-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teklif Al",
  description:
    "Yapı ve inşaat projeleriniz için ücretsiz teklif alın. Uzman ekibimiz en kısa sürede sizinle iletişime geçecek.",
};

async function getPublishedServices() {
  return prisma.service.findMany({
    where: { status: ContentStatus.PUBLISHED },
    select: { id: true, title: true },
    orderBy: { sortOrder: "asc" },
  });
}

export default async function TeklifAlPage() {
  const services = await getPublishedServices();

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-2xl px-4">
        {/* Başlık */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            Ücretsiz Teklif Alın
          </h1>
          <p className="text-lg text-gray-600">
            Projeleriniz için profesyonel destek. Formu doldurun, 24 saat
            içinde sizinle iletişime geçelim.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <LeadForm services={services} />
        </div>

        {/* İletişim Alternatifi */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Hemen konuşmak ister misiniz?{" "}
          <a
            href="tel:+902121234567"
            className="font-medium text-blue-700 hover:text-blue-900"
          >
            +90 (212) 123 45 67
          </a>
        </div>
      </div>
    </main>
  );
}
