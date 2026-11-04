import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface MathToolbarProps {
  onInsert: (snippet: string) => void;
}

export const MathToolbar: React.FC<MathToolbarProps> = ({ onInsert }) => {
  const { t } = useLanguage();

  const mathTools = [
    { label: '\\frac{a}{b}', code: '\\frac{a}{b}', title: t('fraction') },
    { label: 'x^2', code: 'x^{2}', title: t('power') },
    { label: 'x_i', code: 'x_{i}', title: t('subscript') },
    { label: '\\sqrt{x}', code: '\\sqrt{x}', title: t('sqrt') },
    { label: '\\pi', code: '\\pi', title: t('pi') },
    { label: '\\pm', code: '\\pm', title: t('plusMinus') },
    { label: '\\times', code: '\\times', title: t('times') },
    { label: '\\div', code: '\\div', title: t('divide') },
    { label: '\\le', code: '\\le', title: t('lessEqual') },
    { label: '\\ge', code: '\\ge', title: t('greaterEqual') },
    { label: '\\ne', code: '\\ne', title: t('notEqual') },
    { label: '\\approx', code: '\\approx', title: 'Approx' },
    { label: '(x)', code: '\\left( x \\right)', title: 'Brackets' },
    { label: '\\sum', code: '\\sum_{i=1}^{n}', title: t('sum') },
    { label: '\\int', code: '\\int_{a}^{b}', title: t('integral') },
    { label: '\\alpha', code: '\\alpha', title: 'Alpha' },
    { label: '\\beta', code: '\\beta', title: 'Beta' },
    { label: '\\theta', code: '\\theta', title: 'Theta' },
  ];

  return (
    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
      <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
        <span>{t('mathToolbar')}</span>
        <span className="text-[10px] text-indigo-400">KaTeX Math Formula</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {mathTools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            onClick={() => onInsert(tool.code)}
            title={tool.title}
            className="px-2.5 py-1 text-xs font-mono bg-slate-900/90 hover:bg-indigo-600/30 hover:border-indigo-500 border border-slate-700 rounded-lg text-indigo-200 transition-all hover:scale-105 active:scale-95"
          >
            {tool.label}
          </button>
        ))}
      </div>
    </div>
  );
};
