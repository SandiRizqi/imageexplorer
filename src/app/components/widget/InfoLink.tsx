import React from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { useLanguage } from "../context/LanguageProvider";
import { translations } from "../../translations";

export default function InfoLink() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Link
      href="/citra-satelit"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 rounded-full text-white hover:bg-greensecondarycolor hover:text-black transition border border-transparent hover:border-gray-500"
      title={t.csNavExplore}
      aria-label={t.csNavExplore}
    >
      <Info size={20} />
    </Link>
  );
}
