import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './en';
import { zh } from './zh';

const translations = { en, zh };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // default language is english or from localstorage
    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('app_language') || 'en';
        }
        return 'en';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('app_language', lang);
        }
    }, [lang]);

    const t = (key) => {
        return key.split('.').reduce((obj, k) => obj && obj[k], translations[lang]) || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
