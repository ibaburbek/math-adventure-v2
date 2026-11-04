import React from 'react';
import { StudentAccount } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Trophy, Medal, Coins, Star, Crown, Shield } from 'lucide-react';

interface LeaderboardModalProps {
  students: StudentAccount[];
  currentStudentId: string;
  className?: string;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  students,
  currentStudentId,
  className = 'Math Champions',
  onClose,
}) => {
  const { t } = useLanguage();

  // Sort students by coins descending
  const sorted = [...students].sort((a, b) => b.coins - a.coins);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl text-slate-950 shadow-lg shadow-amber-500/20">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-game">{t('viewLeaderboard')}</h2>
              <p className="text-xs text-slate-400">{className}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-2.5 overflow-y-auto flex-1">
          {sorted.length === 0 ? (
            <p className="text-center py-8 text-sm text-slate-500">{t('noLeaderboardData')}</p>
          ) : (
            sorted.map((student, index) => {
              const isCurrentUser = student.id === currentStudentId;
              const rank = index + 1;

              return (
                <div
                  key={student.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    isCurrentUser
                      ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm">
                      {rank === 1 ? (
                        <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/30">
                          <Crown className="w-5 h-5 fill-current" />
                        </div>
                      ) : rank === 2 ? (
                        <div className="w-8 h-8 rounded-xl bg-slate-300 text-slate-950 flex items-center justify-center shadow">
                          <Medal className="w-5 h-5" />
                        </div>
                      ) : rank === 3 ? (
                        <div className="w-8 h-8 rounded-xl bg-amber-700 text-amber-100 flex items-center justify-center shadow">
                          <Medal className="w-5 h-5" />
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">#{rank}</span>
                      )}
                    </div>

                    {/* Character Avatar Icon & Name */}
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white text-base shadow-inner border border-white/20"
                      style={{ backgroundColor: student.characterConfig.primaryColor }}
                    >
                      {student.avatarId === 'wizard' ? '🧙' : student.avatarId === 'robot' ? '🤖' : student.avatarId === 'fox' ? '🦊' : '⚔️'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{student.fullName}</span>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {student.completedLevelsCount || 0} {t('completed')}
                      </span>
                    </div>
                  </div>

                  {/* Coins Counter */}
                  <div className="flex items-center gap-1.5 font-black text-amber-400 text-sm">
                    <Coins className="w-4 h-4" />
                    <span>{student.coins}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
