import React from 'react'
import { useLanguage } from '../context/LanguageProvider';
import { translations } from '../../translations';

export default function AccountContainer() {
    const { language } = useLanguage();
    const t = translations[language];
    return (
        <div className='flex flex-col h-full'>
            <ul className="space-y-2 bg-maincolor text-sm">
                <li className="hover:bg-secondarycolor p-2">{t.profile}</li>
                <li className="hover:bg-secondarycolor p-2">{t.settingsTitle}</li>
                <li className="hover:bg-secondarycolor p-2">{t.logout}</li>
            </ul>
        </div>
    )
}
