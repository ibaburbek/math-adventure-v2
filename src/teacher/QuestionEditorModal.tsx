import React, { useState, useEffect } from 'react';
import { Question, QuestionType, Difficulty, QuestionOption } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { MathToolbar } from './MathToolbar';
import { MathRenderer } from '../components/MathRenderer';
import { sound } from '../services/audio';
import {
  Sparkles,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  Eye,
  HelpCircle,
  FileQuestion,
  Calculator,
} from 'lucide-react';

interface QuestionEditorModalProps {
  initialQuestion?: Question;
  onSave: (question: Question) => void;
  onClose: () => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  initialQuestion,
  onSave,
  onClose,
}) => {
  const { t, language } = useLanguage();

  const [type, setType] = useState<QuestionType>(initialQuestion?.type || 'multiple_choice');
  const [topic, setTopic] = useState<string>(initialQuestion?.topic || 'Fractions');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialQuestion?.difficulty || 'medium');
  const [coinReward, setCoinReward] = useState<number>(initialQuestion?.coinReward || 20);

  // Multi-lingual prompts
  const [promptEn, setPromptEn] = useState<string>(initialQuestion?.prompt.en || '');
  const [promptRu, setPromptRu] = useState<string>(initialQuestion?.prompt.ru || '');
  const [promptKk, setPromptKk] = useState<string>(initialQuestion?.prompt.kk || '');

  // Math formula
  const [mathFormula, setMathFormula] = useState<string>(initialQuestion?.mathFormula || '');

  // Image handling
  const [imageUrl, setImageUrl] = useState<string>(initialQuestion?.imageUrl || '');

  // Multiple choice options (4 or 5 options)
  const [options, setOptions] = useState<QuestionOption[]>(
    initialQuestion?.options || [
      { id: 'opt_1', text: '', isCorrect: true },
      { id: 'opt_2', text: '', isCorrect: false },
      { id: 'opt_3', text: '', isCorrect: false },
      { id: 'opt_4', text: '', isCorrect: false },
    ]
  );

  // Numeric / Text answer
  const [correctAnswer, setCorrectAnswer] = useState<string>(initialQuestion?.correctAnswer || '');
  const [acceptableTolerance, setAcceptableTolerance] = useState<number>(
    initialQuestion?.acceptableTolerance || 0
  );

  // Multi-lingual explanations
  const [explanationEn, setExplanationEn] = useState<string>(initialQuestion?.explanation.en || '');
  const [explanationRu, setExplanationRu] = useState<string>(initialQuestion?.explanation.ru || '');
  const [explanationKk, setExplanationKk] = useState<string>(initialQuestion?.explanation.kk || '');

  const [isManualCheck, setIsManualCheck] = useState<boolean>(initialQuestion?.isManualCheck || false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Adjust coin rewards based on difficulty
  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    if (d === 'easy') setCoinReward(10);
    else if (d === 'medium') setCoinReward(20);
    else if (d === 'hard') setCoinReward(30);
  };

  // Insert formula snippet at end of mathFormula
  const handleInsertMath = (snippet: string) => {
    setMathFormula((prev) => (prev ? `${prev} ${snippet}` : snippet));
  };

  // Clipboard Paste Support (Ctrl+V) for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                setImageUrl(event.target.result as string);
                sound.playStep();
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          sound.playStep();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!promptEn.trim() && !promptRu.trim() && !promptKk.trim()) {
      alert('Please provide a prompt in at least one language.');
      return;
    }

    const questionToSave: Question = {
      id: initialQuestion?.id || `q_${Date.now()}`,
      type,
      topic,
      difficulty,
      coinReward,
      prompt: {
        en: promptEn || promptRu || promptKk,
        ru: promptRu || promptEn || promptKk,
        kk: promptKk || promptEn || promptRu,
      },
      mathFormula: mathFormula.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      options: type === 'multiple_choice' ? options : undefined,
      correctAnswer: type === 'multiple_choice'
        ? options.find((o) => o.isCorrect)?.text || ''
        : correctAnswer,
      acceptableTolerance: type === 'numeric' ? acceptableTolerance : undefined,
      explanation: {
        en: explanationEn || 'Follow standard mathematical steps to arrive at the solution.',
        ru: explanationRu || 'Следуйте математическим шагам для получения решения.',
        kk: explanationKk || 'Шешімге жету үшін стандартты математикалық қадамдарды орындаңыз.',
      },
      isManualCheck: type === 'open_ended' ? true : isManualCheck,
    };

    sound.playCorrect();
    onSave(questionToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-indigo-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-game">
                {initialQuestion ? 'Edit Math Question' : 'Create Math Question'}
              </h2>
              <p className="text-xs text-slate-400">Accessible KaTeX formula editor with 5 question types</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                previewMode
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{t('previewQuestion')}</span>
            </button>
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
          {previewMode ? (
            /* Live Preview Card */
            <div className="bg-slate-950 p-6 rounded-2xl border border-indigo-500/30 space-y-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                Question Preview ({difficulty.toUpperCase()} • +{coinReward} {t('coins')})
              </span>
              <h3 className="text-lg font-bold text-white">
                <MathRenderer text={promptEn || promptRu || promptKk || 'No prompt entered'} />
              </h3>

              {mathFormula && (
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 flex items-center justify-center text-lg text-indigo-200">
                  <MathRenderer formula={mathFormula} />
                </div>
              )}

              {imageUrl && (
                <div className="max-h-48 overflow-hidden rounded-xl border border-slate-700 flex items-center justify-center bg-slate-900">
                  <img src={imageUrl} alt="Math Diagram" className="max-h-48 object-contain" />
                </div>
              )}

              {type === 'multiple_choice' && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {options.map((opt, i) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        opt.isCorrect
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold'
                          : 'border-slate-700 bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      <span>{String.fromCharCode(65 + i)}. {opt.text || `Option ${i + 1}`}</span>
                      {opt.isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Question Form */
            <>
              {/* Type, Topic, Difficulty row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('questionType')}</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                  >
                    <option value="multiple_choice">1. Multiple Choice (4-5 options)</option>
                    <option value="numeric">2. Numeric Answer</option>
                    <option value="text">3. Text Answer</option>
                    <option value="image_based">4. Image-based Question</option>
                    <option value="open_ended">5. Open-ended Math Solution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Fractions, Geometry, Equations"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('difficulty')}</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['easy', 'medium', 'hard'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleDifficultyChange(d)}
                        className={`py-2 text-xs font-bold rounded-xl capitalize transition ${
                          difficulty === d
                            ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                            : 'bg-slate-950 border border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Math Toolbar */}
              <MathToolbar onInsert={handleInsertMath} />

              {/* KaTeX Math Formula Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('mathFormula')}
                </label>
                <input
                  type="text"
                  value={mathFormula}
                  onChange={(e) => setMathFormula(e.target.value)}
                  placeholder="e.g. \frac{3}{4} + \frac{2}{5} = \ ?"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-indigo-300 font-mono text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Prompts in 3 Languages */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Question Prompt (Multi-language)
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 mb-1 block">English</span>
                    <textarea
                      rows={2}
                      value={promptEn}
                      onChange={(e) => setPromptEn(e.target.value)}
                      placeholder="Calculate the area of the rectangle..."
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 mb-1 block">Русский</span>
                    <textarea
                      rows={2}
                      value={promptRu}
                      onChange={(e) => setPromptRu(e.target.value)}
                      placeholder="Вычислите площадь прямоугольника..."
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 mb-1 block">Қазақша</span>
                    <textarea
                      rows={2}
                      value={promptKk}
                      onChange={(e) => setPromptKk(e.target.value)}
                      placeholder="Тікбұрыштың ауданын табыңыз..."
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>

              {/* Image Input (Upload or Clipboard paste Ctrl+V) */}
              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    <span>{t('imageUpload')}</span>
                  </div>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-xs text-rose-400 hover:text-rose-300"
                    >
                      Remove Image
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition">
                    <span>Upload File</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <span className="text-[11px] text-slate-400">or press Ctrl+V anywhere in this window to paste screenshot!</span>
                </div>

                {imageUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden max-h-36 bg-slate-950 border border-slate-700 flex items-center justify-center">
                    <img src={imageUrl} alt="Pasted Diagram" className="max-h-36 object-contain" />
                  </div>
                )}
              </div>

              {/* Multiple Choice Options Builder */}
              {type === 'multiple_choice' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      {t('optionsList')} (Select radio for correct answer)
                    </label>
                    {options.length < 5 && (
                      <button
                        type="button"
                        onClick={() =>
                          setOptions([
                            ...options,
                            { id: `opt_${Date.now()}`, text: '', isCorrect: false },
                          ])
                        }
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add 5th Option
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {options.map((opt, idx) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOptionRadio"
                          checked={opt.isCorrect}
                          onChange={() => {
                            setOptions(
                              options.map((o) => ({ ...o, isCorrect: o.id === opt.id }))
                            );
                          }}
                          className="w-4 h-4 accent-amber-500 cursor-pointer"
                        />
                        <span className="w-6 text-xs font-bold text-slate-400">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOptions(
                              options.map((o) => (o.id === opt.id ? { ...o, text: val } : o))
                            );
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + idx)} text or math...`}
                          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                        />
                        {options.length > 4 && (
                          <button
                            type="button"
                            onClick={() => setOptions(options.filter((o) => o.id !== opt.id))}
                            className="p-1.5 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Numeric / Text Answer Builder */}
              {(type === 'numeric' || type === 'text') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('correctAnswer')}
                    </label>
                    <input
                      type="text"
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      placeholder="e.g. 42 or 3/4"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400 font-mono"
                    />
                  </div>

                  {type === 'numeric' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Acceptable Tolerance (±)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={acceptableTolerance}
                        onChange={(e) => setAcceptableTolerance(parseFloat(e.target.value) || 0)}
                        placeholder="0 for exact integer match"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400 font-mono"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step-by-Step Explanation */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('explanation')}
                </label>
                <textarea
                  rows={2}
                  value={explanationEn}
                  onChange={(e) => setExplanationEn(e.target.value)}
                  placeholder="Show the formula steps: Step 1: Find common denominator... Step 2: Add numerators..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Manual Review Toggle */}
              {type !== 'open_ended' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="manualReviewCheck"
                    checked={isManualCheck}
                    onChange={(e) => setIsManualCheck(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                  />
                  <label htmlFor="manualReviewCheck" className="text-xs font-semibold text-slate-300 cursor-pointer">
                    {t('manualGradingToggle')}
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 transition hover:scale-102"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};
