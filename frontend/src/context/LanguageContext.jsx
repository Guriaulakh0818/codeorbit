import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('codeorbit_lang') || 'en';
  });

  const setLanguage = (lang) => {
    if (lang === 'hinglish' || lang === 'en') {
      setLanguageState(lang);
      localStorage.setItem('codeorbit_lang', lang);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hinglish' : 'en';
    setLanguage(nextLang);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      isHinglish: language === 'hinglish',
      isEnglish: language === 'en'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      toggleLanguage: () => {},
      isHinglish: false,
      isEnglish: true
    };
  }
  return context;
};

export default LanguageContext;
