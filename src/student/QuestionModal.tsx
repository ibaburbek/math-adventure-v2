import React, { useState } from 'react';
import { Question, Difficulty } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { MathRenderer } from '../components/MathRenderer';
import { sound } from '../services/audio';
import confetti from 'canvas-confetti';
import {
  Coins,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Send,
  Upload,
  Clock,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  tileIndex: number;
  totalTiles: number;
  alreadySolved: boolean;
  onAnswerSubmit: (isCorrect: boolean, coinReward: number, manualText?: string) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  tileIndex,
  totalTiles,
  alreadySolved,
  onAnswerSubmit,
  onClose,
}) => {
  const { t, language } = useLanguage();

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<string>('');
  const [openEndedSolution, setOpenEndedSolution] = useState<string>('');
  const [manualSubmitted, setManualSubmitted] = useState<boolean>(false);

  // 3-attempt mechanism
  const [attempts, setAttempts] = useState<number>(0);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState<boolean>(alreadySolved);
  const [showExplanation, setShowExplanation] = useState<boolean>(alreadySolved);
  const [lastAttemptFailed, setLastAttemptFailed] = useState<boolean>(false);

  const maxAttempts = 3;

  const handleMultipleChoiceSelect = (optId: string) => {
    if (isAnsweredCorrectly || showExplanation) return;
    sound.playStep();
    setSelectedOptionId(optId);
  };

  const checkAnswer = () => {
    if (isAnsweredCorrectly || showExplanation) return;

    let correct = false;

    if (question.type === 'multiple_choice' && question.options) {
      const selected = question.options.find((o) => o.id === selectedOptionId);
      correct = Boolean(selected?.isCorrect);
    } else if (question.type === 'numeric') {
      const cleanInput = parseFloat(textInput.trim().replace(',', '.'));
      const targetNum = parseFloat(question.correctAnswer.replace(',', '.'));
      const tol = question.acceptableTolerance || 0.001;
      correct = !isNaN(cleanInput) && Math.abs(cleanInput - targetNum) <= tol;
    } else if (question.type === 'text') {
      correct = textInput.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    } else if (question.type === 'image_based') {
      if (question.options) {
        const selected = question.options.find((o) => o.id === selectedOptionId);
        correct = Boolean(selected?.isCorrect);
      } else {
        correct = textInput.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
      }
    } else if (question.type === 'open_ended') {
      // Manual question submission
      sound.playCorrect();
      setManualSubmitted(true);
      onAnswerSubmit(true, question.coinReward, openEndedSolution);
      return;
    }

    const currentAttemptCount = attempts + 1;
    setAttempts(currentAttemptCount);

    if (correct) {
      sound.playCorrect();
      setIsAnsweredCorrectly(true);
      setLastAttemptFailed(false);
      setShowExplanation(true);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#3b82f6', '#10b981', '#ec4899'],
        });
      } catch {
        // Safe confetti fallback
      }

      // Notify parent to advance 1 step and award coins!
      onAnswerSubmit(true, alreadySolved ? 0 : question.coinReward);
    } else {
      sound.playWrong();
      setLastAttemptFailed(true);

      if (currentAttemptCount >= maxAttempts) {
        // Max 3 attempts reached: reveal answer & explanation, advance without coins
        setShowExplanation(true);
        onAnswerSubmit(false, 0);
      }
    }
  };

  const handleNextTile = () => {
    sound.playStep();
    onClose();
  };

  const promptText = question.prompt[language] || question.prompt.en;
  const explanationText = question.explanation[language] || question.explanation.en;

  const difficultyColors: Record<Difficulty, string> = {
    easy: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    medium: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    hard: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-xs font-bold text-indigo-300">
              {t('tile')} {tileIndex + 1} / {totalTiles}
            </span>
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold border ${
                difficultyColors[question.difficulty]
              }`}
            >
              {question.difficulty.toUpperCase()} (+{question.coinReward} {t('coins')})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Coin reward badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-400 font-bold text-xs">
              <Coins className="w-4 h-4" />
              <span>+{question.coinReward}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Question Prompt */}
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
              <MathRenderer text={promptText} />
            </h3>

            {/* Dedicated KaTeX Math Formula Display */}
            {question.mathFormula && (
              <div className="p-4 bg-slate-950/80 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-center shadow-inner overflow-x-auto text-lg text-indigo-200">
                <MathRenderer formula={question.mathFormula} />
              </div>
            )}

            {/* Attached Image if any */}
            {question.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 max-h-56 bg-slate-950 flex items-center justify-center">
                <img
                  src={question.imageUrl}
                  alt="Question Diagram"
                  className="max-h-56 object-contain"
                />
              </div>
            )}
          </div>

          {/* Interactive Answer Input Formats */}
          <div className="space-y-4 pt-2">
            {/* 1. Multiple Choice */}
            {question.type === 'multiple_choice' && question.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isRightOption = opt.isCorrect;
                  let borderStyle = 'border-slate-700 hover:border-slate-500 bg-slate-800/60';

                  if (showExplanation) {
                    if (isRightOption) {
                      borderStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold';
                    } else if (isSelected && !isRightOption) {
                      borderStyle = 'border-rose-500 bg-rose-500/20 text-rose-300 line-through';
                    }
                  } else if (isSelected) {
                    borderStyle = 'border-amber-400 bg-amber-500/20 text-white font-bold ring-2 ring-amber-400/50';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isAnsweredCorrectly || showExplanation}
                      onClick={() => handleMultipleChoiceSelect(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${borderStyle}`}
                    >
                      <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300 flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div className="flex-1 text-sm">
                        <MathRenderer text={opt.text} />
                        {opt.mathFormula && (
                          <MathRenderer formula={opt.mathFormula} inline={true} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Numeric / Text Input */}
            {(question.type === 'numeric' || question.type === 'text') && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400">
                  {question.type === 'numeric' ? 'Enter numerical answer:' : 'Enter your answer:'}
                </label>
                <input
                  type={question.type === 'numeric' ? 'text' : 'text'}
                  disabled={isAnsweredCorrectly || showExplanation}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={question.type === 'numeric' ? 'e.g. 42 or 3.14' : 'Type here...'}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-2xl text-white font-mono text-base focus:outline-none focus:border-amber-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') checkAnswer();
                  }}
                />
              </div>
            )}

            {/* 3. Open-Ended Mathematical Solution for Teacher Review */}
            {question.type === 'open_ended' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400">
                  Write down your full mathematical step-by-step reasoning for teacher grading:
                </label>
                <textarea
                  disabled={manualSubmitted}
                  rows={4}
                  value={openEndedSolution}
                  onChange={(e) => setOpenEndedSolution(e.target.value)}
                  placeholder="Explain step 1, step 2, equations, and your final deduction..."
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>
            )}
          </div>

          {/* Feedback & Attempt Alerts */}
          {lastAttemptFailed && !showExplanation && (
            <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-200 text-xs md:text-sm font-semibold flex items-center gap-2.5 animate-shake">
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div>
                <p>{t('wrongAnswerMsg')}</p>
                <p className="text-[11px] text-rose-300 font-normal mt-0.5">
                  {t('attemptsLeft')}: {maxAttempts - attempts} / {maxAttempts}
                </p>
              </div>
            </div>
          )}

          {isAnsweredCorrectly && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-200 text-xs md:text-sm font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p>{t('correctAnswerMsg')}</p>
                <p className="text-[11px] text-emerald-300 font-normal">
                  +{alreadySolved ? 0 : question.coinReward} {t('coins')} added to your pouch!
                </p>
              </div>
            </div>
          )}

          {manualSubmitted && (
            <div className="p-3.5 bg-indigo-500/20 border border-indigo-500/40 rounded-2xl text-indigo-200 text-xs md:text-sm font-semibold flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <span>{t('manualReviewPending')}</span>
            </div>
          )}

          {/* Explanation Box (Shown on correct answer or after 3 failed attempts) */}
          {showExplanation && (
            <div className="p-4 bg-slate-950/90 border border-slate-700 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>{t('solutionExplanation')}</span>
              </div>
              <div className="text-xs md:text-sm text-slate-300 leading-relaxed">
                <MathRenderer text={explanationText} />
              </div>
              <div className="pt-2 text-xs text-slate-400 font-mono">
                <span className="font-semibold text-slate-300">Answer: </span>
                <span>{question.correctAnswer}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {!showExplanation && question.type !== 'open_ended' && (
              <span>
                {t('attemptNumber')}: {attempts + 1} / {maxAttempts}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {showExplanation || manualSubmitted ? (
              <button
                type="button"
                onClick={handleNextTile}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition hover:scale-102"
              >
                <span>{t('nextTile')}</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={checkAnswer}
                disabled={
                  (question.type === 'multiple_choice' && !selectedOptionId) ||
                  ((question.type === 'numeric' || question.type === 'text') && !textInput.trim()) ||
                  (question.type === 'open_ended' && !openEndedSolution.trim())
                }
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition hover:scale-102"
              >
                <span>{t('submitAnswer')}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
