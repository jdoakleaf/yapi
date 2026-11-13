import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Yapı Platform",
    template: "%s | Yapı Platform",
  },
  description:
    "İzmir merkezli yapı, inşaat ve uygulama hizmetleri. Anahtar teslim projeler, yalıtım, çatı, tadilat ve daha fazlası.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
