import * as React from 'react';
import { en } from './en';
import { zh } from './zh';

const translations = { en, zh };
const LanguageContext = React.createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = React.useState('en');
    const [initialized, setInitialized] = React.useState(false);

    React.useLayoutEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('app_language');
            if (saved === 'zh' || saved === 'en') {
                setLang(saved);
            }
        }
        setInitialized(true);
    }, []);

    React.useEffect(() => {
        if (typeof window !== 'undefined' && initialized) {
            localStorage.setItem('app_language', lang);
        }
    }, [lang, initialized]);

    const t = (key) => {
        return key.split('.').reduce((obj, k) => obj && obj[k], translations[lang]) || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => React.useContext(LanguageContext);
