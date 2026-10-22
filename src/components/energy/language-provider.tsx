import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translate, type Language } from '@/lib/translations';
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (message: string, values?: Record<string, string | number>) => string; money: (value: number) => string; number: (value: number) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);
export function LanguageProvider({ children }: { children: ReactNode }) {
 const [language, setLanguage] = useState<Language>('de');
 useEffect(() => { document.documentElement.lang = language; }, [language]);
 const locale = language === 'de' ? 'de-AT' : 'en-AT';
 return <LanguageContext.Provider value={{ language, setLanguage, t: (message, values) => translate(language, message, values), money: value => new Intl.NumberFormat(locale, {style:'currency',currency:'EUR'}).format(value), number: value => new Intl.NumberFormat(locale).format(value) }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { const context = useContext(LanguageContext); if (!context) throw new Error('Language provider is required'); return context; }
