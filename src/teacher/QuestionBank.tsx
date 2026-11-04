import React, { useState } from 'react';
import { QuestionSet, Question, ClassRoom, StudentAccount } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { MathRenderer } from '../components/MathRenderer';
import { QuestionEditorModal } from './QuestionEditorModal';
import { sound } from '../services/audio';
import {
  BookOpen,
  Plus,
  Copy,
  Trash2,
  Edit,
  Eye,
  Send,
  Coins,
  ChevronDown,
  ChevronUp,
  Calculator,
} from 'lucide-react';

interface QuestionBankProps {
  questionSets: QuestionSet[];
  classes: ClassRoom[];
  students: StudentAccount[];
  onCreateSet: (set: Omit<QuestionSet, 'id' | 'createdAt'>) => void;
  onUpdateSet: (id: string, updates: Partial<QuestionSet>) => void;
  onDeleteSet: (id: string) => void;
  onAssignSet: (questionSetId: string, classId?: string, studentIds?: string[]) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  questionSets,
  classes,
  students,
  onCreateSet,
  onUpdateSet,
  onDeleteSet,
  onAssignSet,
}) => {
  const { t, language } = useLanguage();

  const [expandedSetId, setExpandedSetId] = useState<string | null>(questionSets[0]?.id || null);
  const [editingQuestion, setEditingQuestion] = useState<{
    setId: string;
    question?: Question;
  } | null>(null);

  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);
  const [assignTargetType, setAssignTargetType] = useState<'class' | 'students'>('class');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Create Set Modal state
  const [showNewSetModal, setShowNewSetModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('Fractions & Decimals');
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleDuplicate = (set: QuestionSet) => {
    sound.playCorrect();
    onCreateSet({
      teacherId: set.teacherId,
      title: `${set.title} (Copy)`,
      topic: set.topic,
      difficulty: set.difficulty,
      coinReward: set.coinReward,
      questions: set.questions.map((q) => ({
        ...q,
        id: `q_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      })),
    });
  };

  const handleSaveQuestion = (question: Question) => {
    if (!editingQuestion) return;
    const targetSet = questionSets.find((s) => s.id === editingQuestion.setId);
    if (!targetSet) return;

    const existingIdx = targetSet.questions.findIndex((q) => q.id === question.id);
    let updatedQuestions: Question[];

    if (existingIdx >= 0) {
      updatedQuestions = [...targetSet.questions];
      updatedQuestions[existingIdx] = question;
    } else {
      updatedQuestions = [...targetSet.questions, question];
    }

    onUpdateSet(targetSet.id, { questions: updatedQuestions });
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (setId: string, questionId: string) => {
    const targetSet = questionSets.find((s) => s.id === setId);
    if (!targetSet) return;
    if (confirm('Delete this question from the set?')) {
      const updated = targetSet.questions.filter((q) => q.id !== questionId);
      onUpdateSet(setId, { questions: updated });
      sound.playStep();
    }
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAssignModal) return;

    if (assignTargetType === 'class') {
      onAssignSet(showAssignModal, selectedClassId, undefined);
    } else {
      onAssignSet(showAssignModal, undefined, selectedStudentIds);
    }

    sound.playCorrect();
    setShowAssignModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white font-game">{t('questionBank')}</h3>
          <p className="text-xs text-slate-400">
            Create reusable 8–10 question quest sets, math formulas, and assignments
          </p>
        </div>

        <button
          onClick={() => {
            sound.playStep();
            setShowNewSetModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition hover:scale-102"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('createQuestionSet')}</span>
        </button>
      </div>

      {/* Question Sets List */}
      <div className="space-y-4">
        {questionSets.map((set) => {
          const isExpanded = expandedSetId === set.id;

          return (
            <div
              key={set.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
            >
              {/* Set Header Accordion */}
              <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 border-b border-slate-800/80">
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => setExpandedSetId(isExpanded ? null : set.id)}
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{set.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                        {set.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span>{set.topic}</span>
                      <span>•</span>
                      <span>{set.questions.length} questions</span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">+{set.coinReward} {t('coins')} / q</span>
                    </div>
                  </div>
                </div>

                {/* Set Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playStep();
                      setShowAssignModal(set.id);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Assign</span>
                  </button>

                  <button
                    onClick={() => handleDuplicate(set)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                    title="Duplicate Set"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete question set ${set.title}?`)) {
                        onDeleteSet(set.id);
                        sound.playStep();
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                    title="Delete Set"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setExpandedSetId(isExpanded ? null : set.id)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-xl"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Questions List (when expanded) */}
              {isExpanded && (
                <div className="p-4 space-y-3 bg-slate-900/40">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">Questions in this Set</span>
                    <button
                      onClick={() => {
                        sound.playStep();
                        setEditingQuestion({ setId: set.id });
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Question
                    </button>
                  </div>

                  {set.questions.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-500">No questions in this set yet.</p>
                  ) : (
                    set.questions.map((q, qIndex) => (
                      <div
                        key={q.id}
                        className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:border-slate-700 transition"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-400 flex-shrink-0 mt-0.5">
                            {qIndex + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-white leading-relaxed">
                              <MathRenderer text={q.prompt[language] || q.prompt.en} />
                            </p>
                            {q.mathFormula && (
                              <div className="mt-1 text-xs text-indigo-300 font-mono">
                                <MathRenderer formula={q.mathFormula} inline={true} />
                              </div>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                              <span className="capitalize">{q.type.replace('_', ' ')}</span>
                              <span>•</span>
                              <span>Answer: {q.correctAnswer}</span>
                              {q.isManualCheck && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  Manual Review
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end md:self-center">
                          <button
                            onClick={() => setEditingQuestion({ setId: set.id, question: q })}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                            title="Edit Question"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(set.id, q.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                            title="Delete Question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create New Set Modal */}
      {showNewSetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-game mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>{t('createQuestionSet')}</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Set Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Fraction Quest Level 2"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('setTopic')}</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Fractions, Geometry, Pre-Algebra"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('difficulty')}</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                >
                  <option value="easy">{t('easy')}</option>
                  <option value="medium">{t('medium')}</option>
                  <option value="hard">{t('hard')}</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewSetModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newTitle.trim()) return;
                    const coinReward = newDifficulty === 'easy' ? 10 : newDifficulty === 'medium' ? 20 : 30;
                    onCreateSet({
                      teacherId: 'teacher_1',
                      title: newTitle.trim(),
                      topic: newTopic.trim(),
                      difficulty: newDifficulty,
                      coinReward,
                      questions: [],
                    });
                    sound.playCorrect();
                    setShowNewSetModal(false);
                    setNewTitle('');
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Create Set
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-game mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-400" />
              <span>Assign Question Quest</span>
            </h3>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="radio"
                    name="assignTarget"
                    checked={assignTargetType === 'class'}
                    onChange={() => setAssignTargetType('class')}
                    className="accent-amber-500"
                  />
                  <span>Entire Class</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="radio"
                    name="assignTarget"
                    checked={assignTargetType === 'students'}
                    onChange={() => setAssignTargetType('students')}
                    className="accent-amber-500"
                  />
                  <span>Selected Students</span>
                </label>
              </div>

              {assignTargetType === 'class' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Class</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.grade})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Select Students</label>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
                    {students.map((st) => (
                      <label key={st.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(st.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds([...selectedStudentIds, st.id]);
                            } else {
                              setSelectedStudentIds(selectedStudentIds.filter((id) => id !== st.id));
                            }
                          }}
                          className="accent-amber-500"
                        />
                        <span>{st.fullName} (@{st.username})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Send Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Editor Modal */}
      {editingQuestion && (
        <QuestionEditorModal
          initialQuestion={editingQuestion.question}
          onSave={handleSaveQuestion}
          onClose={() => setEditingQuestion(null)}
        />
      )}
    </div>
  );
};
