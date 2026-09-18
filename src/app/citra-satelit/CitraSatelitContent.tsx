"use client";

import Link from "next/link";
import { useLanguage } from "../components/context/LanguageProvider";
import { translations } from "../translations";
import LanguageSwitcher from "../components/widget/LanguageSwitcher";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281298735585";

const highResolutionSatellites = [
  { name: "Pleiades Neo", resolution: "30 cm", minOrder: 25 },
  { name: "WorldView Legion", resolution: "30 cm", minOrder: 25 },
  { name: "WorldView-4", resolution: "30 cm", minOrder: 25 },
  { name: "WorldView-5", resolution: "30 cm", minOrder: 25 },
  { name: "WorldView-2", resolution: "40 cm", minOrder: 25 },
  { name: "GeoEye-1", resolution: "40 cm", minOrder: 25 },
  { name: "Pleiades 1", resolution: "50 cm", minOrder: 25 },
  { name: "BJ3N", resolution: "30 cm", minOrder: 25 },
  { name: "Superview Neo - 1 & Neo 3", resolution: "30 | 50 cm", minOrder: 25 },
  { name: "Jilin - 1", resolution: "75 cm", minOrder: 50 },
  { name: "SuperView-2", resolution: "40 cm", minOrder: 25 },
  { name: "SuperView-1", resolution: "50 cm", minOrder: 25 },
  { name: "BJ3A", resolution: "50 cm", minOrder: 25 },
  { name: "SkySat", resolution: "50 cm", minOrder: 25 },
  { name: "KOMPSAT-3A", resolution: "40 cm", minOrder: 25 },
  { name: "QuickBird", resolution: "60 cm", minOrder: 25 },
  { name: "Kompsat-3", resolution: "70 cm", minOrder: 25 },
  { name: "EROS B", resolution: "70 cm", minOrder: 25 },
  { name: "GEOSAT-2", resolution: "75 cm", minOrder: 25 },
  { name: "IKONOS", resolution: "80 cm", minOrder: 25 },
  { name: "GaoFen-2", resolution: "80 cm", minOrder: 25 },
  { name: "OVS-3", resolution: "90 cm", minOrder: 131 },
  { name: "TripleSat", resolution: "80 cm", minOrder: 25 },
  { name: "KazEOSat-1", resolution: "50 cm", minOrder: 100 },
  { name: "TeLEOS-1", resolution: "100 cm", minOrder: 100 },
  { name: "KOMPSAT-2", resolution: "100 cm", minOrder: 25 },
];

const mediumResolutionSatellites = [
  { name: "SPOT 6-7", resolution: "150 cm", minOrder: 100 },
  { name: "PlanetScope", resolution: "300 cm", minOrder: 250 },
  { name: "RapidEye", resolution: "500 cm", minOrder: 375 },
  { name: "FORMOSAT-5", resolution: "200 cm", minOrder: 200 },
  { name: "FORMOSAT-2", resolution: "200 cm", minOrder: 200 },
  { name: "GaoFen-1", resolution: "200 cm", minOrder: 500 },
  { name: "EROS A", resolution: "200 cm", minOrder: 375 },
  { name: "ZiYuan-3", resolution: "250 - 350 cm", minOrder: 500 },
  { name: "KazEOSat-2", resolution: "650 cm", minOrder: 500 },
  { name: "Orbita Hyperspectral Satellite (OHS)", resolution: "1000 cm", minOrder: 2500 },
  { name: "GEOSAT-1", resolution: "2200 cm", minOrder: 6000 },
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                {t.csFleetHighResTitle}
              </h3>
              <div className="border border-gray-700 rounded-lg overflow-auto max-h-80">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="sticky top-0 bg-secondarycolor">
                    <tr className="text-left">
                      <th className="px-3 py-2 text-gray-400 font-semibold">No</th>
                      <th className="px-3 py-2 text-gray-400 font-semibold">
                        {t.csFleetNameLabel}
                      </th>
                      <th className="px-3 py-2 text-gray-400 font-semibold whitespace-nowrap">
                        {t.csFleetResolutionLabel}
                      </th>
                      <th className="px-3 py-2 text-gray-400 font-semibold whitespace-nowrap">
                        {t.csFleetMinOrderLabel}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {highResolutionSatellites.map((sat, idx) => (
                      <tr key={sat.name}>
                        <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                        <td className="px-3 py-2 text-gray-200">{sat.name}</td>
                        <td className="px-3 py-2 text-greenmaincolor whitespace-nowrap">
                          {sat.resolution}
                        </td>
                        <td className="px-3 py-2 text-gray-400 whitespace-nowrap">
                          {sat.minOrder} km²
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                {t.csFleetMediumResTitle}
              </h3>
              <div className="border border-gray-700 rounded-lg overflow-auto max-h-80">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="sticky top-0 bg-secondarycolor">
                    <tr className="text-left">
                      <th className="px-3 py-2 text-gray-400 font-semibold">No</th>
                      <th className="px-3 py-2 text-gray-400 font-semibold">
                        {t.csFleetNameLabel}
                      </th>
                      <th className="px-3 py-2 text-gray-400 font-semibold whitespace-nowrap">
                        {t.csFleetResolutionLabel}
                      </th>
                      <th className="px-3 py-2 text-gray-400 font-semibold whitespace-nowrap">
                        {t.csFleetMinOrderLabel}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {mediumResolutionSatellites.map((sat, idx) => (
                      <tr key={sat.name}>
                        <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                        <td className="px-3 py-2 text-gray-200">{sat.name}</td>
                        <td className="px-3 py-2 text-greenmaincolor whitespace-nowrap">
                          {sat.resolution}
                        </td>
                        <td className="px-3 py-2 text-gray-400 whitespace-nowrap">
                          {sat.minOrder} km²
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
