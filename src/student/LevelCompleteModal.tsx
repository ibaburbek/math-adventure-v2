import React, { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../services/audio';
import confetti from 'canvas-confetti';
import { Trophy, Star, Coins, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface LevelCompleteModalProps {
  levelNumber: number;
  worldName: string;
  totalCoinsEarned: number;
  stars: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onClose: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelNumber,
  worldName,
  totalCoinsEarned,
  stars,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onClose,
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    sound.playVictory();
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#3b82f6', '#10b981', '#ec4899'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 md:p-8 text-center shadow-2xl overflow-hidden">
        {/* Glow halo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Trophy Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 mb-5 animate-bounce">
          <Trophy className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white font-game mb-2">
          {t('levelCompleteTitle')}
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto mb-6">
          {t('levelCompleteDesc')} ({worldName} — {t('level')} {levelNumber})
        </p>

        {/* Stars Display */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2.5 rounded-2xl border transition-all ${
                starIdx <= stars
                  ? 'bg-amber-500/20 border-amber-400 text-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/40 border-slate-700 text-slate-600'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </div>
          ))}
        </div>

        {/* Reward Summary Card */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 mb-6 flex items-center justify-around">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">{t('starsEarned')}</span>
            <span className="text-xl font-black text-amber-400">{stars} / 3</span>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">{t('coinsEarned')}</span>
            <div className="flex items-center justify-center gap-1.5 text-xl font-black text-amber-400">
              <Coins className="w-5 h-5" />
              <span>+{totalCoinsEarned}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReplay}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('replayLevel')}</span>
          </button>

          {hasNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-xs md:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition hover:scale-105"
            >
              <span>{t('continueAdventure')}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}

          {!hasNextLevel && (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-black text-xs md:text-sm shadow-xl flex items-center justify-center gap-2 transition"
            >
              <span>{t('backToHome')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
