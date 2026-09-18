"use client";

import Link from "next/link";
import { useLanguage } from "../components/context/LanguageProvider";
import { translations } from "../translations";
import LanguageSwitcher from "../components/widget/LanguageSwitcher";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281298735585";

const satelliteFleet = [
  { name: "BJ3A", resolution: "50 cm" },
  { name: "SuperView-2", resolution: "40 cm" },
  { name: "BJ3N", resolution: "30 cm" },
  { name: "SuperView Neo", resolution: "30 cm" },
  { name: "TerraSAR-X (Radar)", resolution: "25 cm" },
];

export default function CitraSatelitContent() {
  const { language } = useLanguage();
  const t = translations[language];

  const whatsappMessage =
    language === "ID"
      ? "Halo, saya ingin bertanya tentang jual beli citra satelit resolusi tinggi."
      : "Hello, I'd like to ask about buying/selling high-resolution satellite imagery.";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const orderSteps = [
    { title: t.csStep1Title, desc: t.csStep1Desc },
    { title: t.csStep2Title, desc: t.csStep2Desc },
    { title: t.csStep3Title, desc: t.csStep3Desc },
    { title: t.csStep4Title, desc: t.csStep4Desc },
    { title: t.csStep5Title, desc: t.csStep5Desc },
    { title: t.csStep6Title, desc: t.csStep6Desc },
  ];

  return (
    <div className="min-h-screen bg-maincolor text-gray-300">
      <header className="border-b border-gray-700 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="text-greenmaincolor font-bold">
            Ruang Bumi Explorer
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 bg-greenmaincolor hover:bg-greensecondarycolor text-gray-900 font-bold rounded-lg transition-colors"
            >
              {t.csNavExplore}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-4 pt-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-greensecondarycolor leading-tight">
            {t.csHeroTitle}
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            {t.csHeroDesc}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-greenmaincolor hover:bg-greensecondarycolor text-gray-900 font-bold rounded-lg transition-colors shadow-md"
            >
              {t.csCtaExplore}
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-md"
            >
              {t.csCtaWhatsapp}
            </a>
          </div>
        </section>

        {/* Apa itu citra satelit */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.csWhatTitle}</h2>
          <p className="leading-relaxed">{t.csWhatDesc}</p>
        </section>

        {/* Fleet / resolusi */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.csFleetTitle}</h2>
          <p className="leading-relaxed">{t.csFleetDesc}</p>
          <ul className="divide-y divide-gray-700 border border-gray-700 rounded-lg overflow-hidden">
            {satelliteFleet.map((sat) => (
              <li
                key={sat.name}
                className="flex items-center justify-between px-4 py-3 text-sm sm:text-base"
              >
                <span className="font-semibold text-gray-200">{sat.name}</span>
                <span className="text-greenmaincolor">
                  {t.csFleetResolutionLabel} {sat.resolution}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Cara beli */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.csHowTitle}</h2>
          <ol className="space-y-4">
            {orderSteps.map((step, idx) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-greensecondarycolor text-gray-900 font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-200">{step.title}</p>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Untuk siapa */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.csWhoTitle}</h2>
          <p className="leading-relaxed">{t.csWhoDesc}</p>
        </section>

        {/* CTA penutup */}
        <section className="text-center space-y-4 py-8 border-t border-gray-700">
          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.csClosingTitle}</h2>
          <p className="max-w-2xl mx-auto leading-relaxed">{t.csClosingDesc}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-greenmaincolor hover:bg-greensecondarycolor text-gray-900 font-bold rounded-lg transition-colors shadow-md"
            >
              {t.csNavExplore}
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-md"
            >
              {t.csCtaWhatsapp}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
