import type { Metadata } from "next";
import CitraSatelitContent from "./CitraSatelitContent";

const siteUrl =
  process.env.NEXT_PUBLIC_HOST && process.env.NEXT_PUBLIC_HOST.startsWith("http")
    ? process.env.NEXT_PUBLIC_HOST
    : "https://explorer.ruangbumi.com";

export const metadata: Metadata = {
  title: "Jual Beli & Pengadaan Citra Satelit Resolusi Tinggi | Ruang Bumi Explorer",
  description:
    "Jual beli dan pengadaan citra satelit resolusi tinggi mulai dari 30 cm untuk kebutuhan pemetaan, riset, dan bisnis. Cari, pesan, dan unduh citra satelit terbaru dari berbagai satelit langsung secara online.",
  alternates: {
    canonical: `${siteUrl}/citra-satelit`,
  },
  openGraph: {
    title: "Jual Beli & Pengadaan Citra Satelit Resolusi Tinggi | Ruang Bumi Explorer",
    description:
      "Jual beli dan pengadaan citra satelit resolusi tinggi mulai dari 30 cm untuk kebutuhan pemetaan, riset, dan bisnis. Cari, pesan, dan unduh citra satelit terbaru secara online.",
    url: `${siteUrl}/citra-satelit`,
    siteName: "Ruang Bumi Explorer",
    locale: "id_ID",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Jual Beli dan Pengadaan Citra Satelit Resolusi Tinggi",
  provider: {
    "@type": "Organization",
    name: "Ruang Bumi Explorer",
    url: siteUrl,
  },
  areaServed: "ID",
  description:
    "Layanan jual beli dan pengadaan citra satelit resolusi tinggi mulai dari 30 cm untuk kebutuhan pemetaan, riset, dan bisnis.",
};

export default function CitraSatelitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CitraSatelitContent />
    </>
  );
}
