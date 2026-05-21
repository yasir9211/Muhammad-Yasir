/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface StatCardProps {
  id: string;
  title: string;
  value: string;
  subValue?: string;
  icon: ReactNode;
  theme: 'emerald' | 'cyan' | 'amber' | 'indigo' | 'rose';
  isUrdu?: boolean;
}

export function StatCard({ id, title, value, subValue, icon, theme, isUrdu = false }: StatCardProps) {
  const themes = {
    emerald: {
      bg: "bg-emerald-950/20 border-emerald-900/40 hover:border-emerald-500/30",
      accent: "text-emerald-400 bg-emerald-500/10",
      glow: "group-hover:bg-emerald-500/5",
    },
    cyan: {
      bg: "bg-cyan-950/20 border-cyan-900/40 hover:border-cyan-500/30",
      accent: "text-cyan-400 bg-cyan-500/10",
      glow: "group-hover:bg-cyan-500/5",
    },
    amber: {
      bg: "bg-amber-950/20 border-amber-900/40 hover:border-amber-500/30",
      accent: "text-amber-400 bg-amber-500/10",
      glow: "group-hover:bg-amber-500/5",
    },
    indigo: {
      bg: "bg-indigo-950/20 border-indigo-900/40 hover:border-indigo-500/30",
      accent: "text-indigo-400 bg-indigo-500/10",
      glow: "group-hover:bg-indigo-500/5",
    },
    rose: {
      bg: "bg-rose-950/20 border-rose-900/40 hover:border-rose-500/30",
      accent: "text-rose-400 bg-rose-500/10",
      glow: "group-hover:bg-rose-500/5",
    }
  };

  const selectedTheme = themes[theme] || themes.indigo;

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${selectedTheme.bg}`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Decorative background glow */}
      <div 
        className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl transition-all duration-500 ${selectedTheme.glow}`} 
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-400 text-xs font-semibold tracking-wider uppercase mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-neutral-50 tracking-tight font-mono">
            {value}
          </h3>
          {subValue && (
            <p className="text-neutral-400 text-xs mt-1 font-medium font-sans">
              {subValue}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${selectedTheme.accent} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
