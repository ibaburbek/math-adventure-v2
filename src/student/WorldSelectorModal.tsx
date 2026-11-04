import React from 'react';
import { World } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Compass, CheckCircle2, ChevronRight, Trees, Sun, Snowflake, Castle } from 'lucide-react';
import { sound } from '../services/audio';

interface WorldSelectorModalProps {
  worlds: World[];
  currentWorldId: string;
  onSelectWorld: (worldId: string) => void;
  onClose: () => void;
}

export const WorldSelectorModal: React.FC<WorldSelectorModalProps> = ({
  worlds,
  currentWorldId,
  onSelectWorld,
  onClose,
}) => {
  const { t, language } = useLanguage();

  const worldIcons: Record<World['theme'], React.ReactNode> = {
    forest: <Trees className="w-6 h-6 text-emerald-400" />,
    desert: <Sun className="w-6 h-6 text-amber-400" />,
    ice: <Snowflake className="w-6 h-6 text-cyan-400" />,
    castle: <Castle className="w-6 h-6 text-purple-400" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-indigo-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-game">{t('selectWorld')}</h2>
              <p className="text-xs text-slate-400">Explore interconnected mathematical fantasy realms</p>
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
          {worlds.map((world, idx) => {
            const isSelected = world.id === currentWorldId;
            return (
              <button
                key={world.id}
                onClick={() => {
                  sound.playStep();
                  onSelectWorld(world.id);
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    {worldIcons[world.theme]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        {t('world')} {idx + 1}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white font-game mt-0.5">
                      {world.name[language]}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {world.description[language]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 group-hover:text-amber-400 transition-colors">
                  <span className="text-xs font-semibold">{world.levelsCount} {t('level')}s</span>
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
