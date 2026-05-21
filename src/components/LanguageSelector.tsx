/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
}

export function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-neutral-900/60 p-1 rounded-xl border border-neutral-800" id="lang-selector-container">
      <Globe className="w-4 h-4 text-emerald-400 ml-1" id="lang-globe-icon" />
      <button
        id="btn-lang-en"
        onClick={() => setLanguage('en')}
        className={`relative px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
          language === 'en'
            ? 'text-neutral-900 font-semibold'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        {language === 'en' && (
          <motion.div
            layoutId="activeLang"
            className="absolute inset-0 bg-emerald-400 rounded-lg -z-[1]"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        English
      </button>
      <button
        id="btn-lang-ur"
        onClick={() => setLanguage('ur')}
        className={`relative px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
          language === 'ur'
            ? 'text-neutral-900'
            : 'text-neutral-400 hover:text-white'
        }`}
        style={{ fontFamily: language === 'ur' ? 'Jameel Noori Nastaleeq, system-ui' : 'inherit' }}
      >
        {language === 'ur' && (
          <motion.div
            layoutId="activeLang"
            className="absolute inset-0 bg-emerald-400 rounded-lg -z-[1]"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        اردو
      </button>
    </div>
  );
}
