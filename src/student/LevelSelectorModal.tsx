import React from 'react';
import { Level, StudentProgress } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Trophy, Star, Lock, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { sound } from '../services/audio';

interface LevelSelectorModalProps {
  levels: Level[];
  currentLevelId: string;
  allProgress: Record<string, StudentProgress>;
  onSelectLevel: (levelId: string) => void;
  onClose: () => void;
}

export const LevelSelectorModal: React.FC<LevelSelectorModalProps> = ({
  levels,
  currentLevelId,
  allProgress,
  onSelectLevel,
  onClose,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-game">Select Level Quest</h2>
              <p className="text-xs text-slate-400">Choose your mathematical trail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-3 overflow-y-auto flex-1">
          {levels.map((lvl, index) => {
            const isSelected = lvl.id === currentLevelId;
            const progress = allProgress[lvl.id];
            // Level is unlocked if it's level 1 or previous level was completed
            const prevLevel = index > 0 ? levels[index - 1] : null;
            const isUnlocked = index === 0 || (prevLevel && allProgress[prevLevel.id]?.isCompleted) || progress?.currentTile > 0;
            const isCompleted = progress?.isCompleted;

            return (
              <button
                key={lvl.id}
                disabled={!isUnlocked}
                onClick={() => {
                  sound.playStep();
                  onSelectLevel(lvl.id);
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                    : isUnlocked
                    ? 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                    : 'bg-slate-900/40 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold font-mono text-base ${
                      isCompleted
                        ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-300'
                        : isUnlocked
                        ? 'bg-indigo-600/30 border border-indigo-500 text-indigo-300'
                        : 'bg-slate-800 border border-slate-700 text-slate-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : isUnlocked ? (
                      <span>{lvl.levelNumber}</span>
                    ) : (
                      <Lock className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        {t('level')} {lvl.levelNumber}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white font-game mt-0.5">
                      {lvl.title[language]}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>{lvl.totalTiles} {t('tile')}s</span>
                      {isCompleted && (
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{progress?.stars || 3} / 3</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-slate-400">
                  {isUnlocked ? (
                    <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-amber-500 text-slate-300 group-hover:text-slate-950 transition">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
