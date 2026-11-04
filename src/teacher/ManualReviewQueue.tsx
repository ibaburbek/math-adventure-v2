import React, { useState } from 'react';
import { ManualSubmission } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../services/audio';
import { MathRenderer } from '../components/MathRenderer';
import { CheckCircle2, XCircle, Clock, MessageSquare, Coins, Image as ImageIcon } from 'lucide-react';

interface ManualReviewQueueProps {
  submissions: ManualSubmission[];
  onReview: (id: string, status: 'approved' | 'rejected', feedback?: string) => void;
}

export const ManualReviewQueue: React.FC<ManualReviewQueueProps> = ({
  submissions,
  onReview,
}) => {
  const { t } = useLanguage();
  const [feedbackTexts, setFeedbackTexts] = useState<Record<string, string>>({});

  const pendingList = submissions.filter((s) => s.status === 'pending');
  const historyList = submissions.filter((s) => s.status !== 'pending');

  const handleApprove = (id: string) => {
    sound.playCorrect();
    onReview(id, 'approved', feedbackTexts[id] || 'Outstanding mathematical proof and clarity!');
  };

  const handleReject = (id: string) => {
    sound.playWrong();
    onReview(id, 'rejected', feedbackTexts[id] || 'Please review step 2 and recalculate.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-white font-game">{t('manualReviews')}</h3>
        <p className="text-xs text-slate-400">
          Grade open-ended mathematical solutions, verify student working steps, and award coins
        </p>
      </div>

      {/* Pending Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Pending Submissions ({pendingList.length})</span>
        </div>

        {pendingList.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            🎉 All caught up! No pending student submissions requiring review.
          </div>
        ) : (
          pendingList.map((sub) => (
            <div
              key={sub.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="font-bold text-white text-sm block">{sub.studentName}</span>
                  <span className="text-xs text-slate-400">
                    {sub.questionTitle} • Tile {sub.tileIndex + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-400 font-bold text-xs">
                  <Coins className="w-4 h-4" />
                  <span>+{sub.coinReward} {t('coins')} Reward</span>
                </div>
              </div>

              {/* Student's solution */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Student&apos;s Solution:
                </span>
                <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-mono">
                  {sub.solutionText}
                </p>

                {sub.imageUrl && (
                  <div className="pt-2">
                    <img
                      src={sub.imageUrl}
                      alt="Student work screenshot"
                      className="max-h-48 rounded-lg border border-slate-700 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Teacher Feedback input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t('feedbackComment')}</span>
                </label>
                <input
                  type="text"
                  value={feedbackTexts[sub.id] || ''}
                  onChange={(e) =>
                    setFeedbackTexts((prev) => ({ ...prev, [sub.id]: e.target.value }))
                  }
                  placeholder="e.g. Great reasoning! Remember to write the unit of measurement."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Review Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleReject(sub.id)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>{t('reject')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(sub.id)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('approve')}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* History Section */}
      {historyList.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Recent Review History
          </span>
          <div className="space-y-2">
            {historyList.slice(0, 5).map((h) => (
              <div
                key={h.id}
                className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white">{h.studentName}</span>
                  <span className="text-slate-400 ml-2">({h.questionTitle})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      h.status === 'approved'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-rose-500/15 text-rose-300'
                    }`}
                  >
                    {h.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
