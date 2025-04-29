'use client';

import { useState } from 'react';

type Locale = 'ja' | 'ko';

interface LocaleSelectorProps {
  onChange: (locale: Locale) => void;
  currentLocale?: Locale;
}

export default function LocaleSelector({ onChange, currentLocale = 'ja' }: LocaleSelectorProps) {
  const [locale, setLocale] = useState<Locale>(currentLocale);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    setLocale(newLocale);
    onChange(newLocale);
  };

  return (
    <div className="locale-selector">
      <select 
        value={locale} 
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="ja">日本語</option>
        <option value="ko">한국어</option>
      </select>
    </div>
  );
}
