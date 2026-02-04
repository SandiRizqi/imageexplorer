"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../components/context/LanguageProvider";
import { translations } from "../translations";

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-maincolor flex flex-col text-gray-300">
      {/* Header */}
      <header className="bg-maincolor border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-greensecondarycolor">{t.ppTitle}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-3xl space-y-6">
          <p className="text-gray-400">{t.ppEffectiveDate}</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.ppIntroTitle}</h2>
          <p>{t.ppIntroContent}</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.ppInfoTitle}</h2>
          <ul className="list-disc pl-6 text-gray-400">
            <li><strong>{t.ppInfoPersonal}</strong> {t.ppInfoPersonalDesc}</li>
            <li><strong>{t.ppInfoTechnical}</strong> {t.ppInfoTechnicalDesc}</li>
            <li><strong>{t.ppInfoTransactional}</strong> {t.ppInfoTransactionalDesc}</li>
            <li><strong>{t.ppInfoCommunications}</strong> {t.ppInfoCommunicationsDesc}</li>
          </ul>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.ppUseTitle}</h2>
          <ul className="list-disc pl-6 text-gray-400">
            <li>{t.ppUse1}</li>
            <li>{t.ppUse2}</li>
            <li>{t.ppUse3}</li>
            <li>{t.ppUse4}</li>
          </ul>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.ppSharingTitle}</h2>
          <p>{t.ppSharingContent}</p>
          <ul className="list-disc pl-6 text-gray-400">
            <li><strong>{t.ppSharingProviders}</strong> {t.ppSharingProvidersDesc}</li>
            <li><strong>{t.ppSharingLegal}</strong> {t.ppSharingLegalDesc}</li>
            <li><strong>{t.ppSharingBusiness}</strong> {t.ppSharingBusinessDesc}</li>
          </ul>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.ppSecurityTitle}</h2>
          <p>{t.ppSecurityContent}</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.ppRightsTitle}</h2>
          <ul className="list-disc pl-6 text-gray-400">
            <li>{t.ppRights1}</li>
            <li>{t.ppRights2}</li>
            <li>{t.ppRights3}</li>
          </ul>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.ppCookiesTitle}</h2>
          <p>{t.ppCookiesContent}</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.ppLinksTitle}</h2>
          <p>{t.ppLinksContent}</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.ppChangesTitle}</h2>
          <p>{t.ppChangesContent}</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">{t.ppContactTitle}</h2>
          <p>{t.ppContactContent}</p>
          <p>Ruang Bumi</p>
          <p>Email: admin@ruangbumi.com</p>
          <p>Phone: +6282170829587</p>

          <div className="text-center mt-6">
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-greenmaincolor text-gray-900 rounded-lg hover:bg-greensecondarycolor transition-colors duration-200 font-semibold">
              {t.backToHome}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-maincolor border-t border-gray-700 p-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} ruangbumi. {t.allRightsReserved}
      </footer>
    </div>
  );
};






export default function page() {
  return (
    <div>
      <PrivacyPolicy />
    </div>
  )
}
