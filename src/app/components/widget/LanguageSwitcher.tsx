import React from 'react';
import { useLanguage } from '../context/LanguageProvider';

import { translations } from '../../translations';

export default function LanguageSwitcher() {
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center justify-center w-10 h-10 rounded-full text-white hover:bg-greensecondarycolor hover:text-black transition font-bold text-sm border border-transparent hover:border-gray-500"
            title={language === 'ID' ? t.switchToEnglish : t.switchToIndonesian}
        >
            {language}
        </button>
    );
}
