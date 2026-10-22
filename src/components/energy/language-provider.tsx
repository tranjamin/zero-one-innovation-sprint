import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { pageMetadata } from '@/lib/page-metadata';
import { translate, type Language } from '@/lib/translations';
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (message: string, values?: Record<string, string | number>) => string; money: (value: number) => string; number: (value: number) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);
export function LanguageProvider({ children }: { children: ReactNode }) {
 const pathname = useRouterState({select: state => state.location.pathname});
 const [language, setLanguage] = useState<Language>('de');
 useEffect(() => {
  document.documentElement.lang = language;
  const updateMetadata = () => {
  for (const meta of pageMetadata(pathname, language).meta) {
   if ('title' in meta && meta.title && document.title !== meta.title) document.title = meta.title;
   else { const key = 'name' in meta ? 'name' : 'property'; const value = 'name' in meta ? meta.name : 'property' in meta ? meta.property : undefined;
    if (value && 'content' in meta && meta.content) {
     const element = document.querySelector(`meta[${key}="${value}"]`);
     if (element?.getAttribute('content') !== meta.content) element?.setAttribute('content',meta.content);
    }
   }
  }
  };
  updateMetadata();
  const observer = new MutationObserver(updateMetadata);
  observer.observe(document.head, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['content']});
  return () => observer.disconnect();
 }, [language, pathname]);
 const locale = language === 'de' ? 'de-AT' : 'en-GB';
 return <LanguageContext.Provider value={{ language, setLanguage, t: (message, values) => translate(language, message, values), money: value => new Intl.NumberFormat(locale, {style:'currency',currency:'EUR'}).format(value), number: value => new Intl.NumberFormat(locale).format(value) }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { const context = useContext(LanguageContext); if (!context) throw new Error('Language provider is required'); return context; }
