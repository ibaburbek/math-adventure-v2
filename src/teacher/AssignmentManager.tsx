import React, { useState } from 'react';
import { Assignment, QuestionSet, ClassRoom } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../services/audio';
import { Send, Plus, Calendar, BookOpen, School, Trash2, CheckCircle2 } from 'lucide-react';

interface AssignmentManagerProps {
  assignments: Assignment[];
  questionSets: QuestionSet[];
  classes: ClassRoom[];
  onCreateAssignment: (a: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onDeleteAssignment: (id: string) => void;
}

export const AssignmentManager: React.FC<AssignmentManagerProps> = ({
  assignments,
  questionSets,
  classes,
  onCreateAssignment,
  onDeleteAssignment,
}) => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedSetId, setSelectedSetId] = useState(questionSets[0]?.id || '');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-11-20');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedSetId) return;

    onCreateAssignment({
      teacherId: 'teacher_1',
      title: title.trim(),
      questionSetId: selectedSetId,
      classId: selectedClassId || undefined,
      dueDate,
    });

    sound.playCorrect();
    setShowModal(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white font-game">{t('assignments')}</h3>
          <p className="text-xs text-slate-400">Track homework challenges and class quest deadlines</p>
        </div>

        <button
          onClick={() => {
            sound.playStep();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition hover:scale-102"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((asgn) => {
          const qSet = questionSets.find((s) => s.id === asgn.questionSetId);
          const cls = classes.find((c) => c.id === asgn.classId);

          return (
            <div
              key={asgn.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                    <Send className="w-3 h-3" />
                    Active Quest
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Due {asgn.dueDate || 'Soon'}
                  </span>
                </div>

                <h4 className="font-bold text-white text-base mb-1">{asgn.title}</h4>

                <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-300 font-semibold">{qSet?.title || 'Question Set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{cls ? cls.name : 'Assigned to Students'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Progress
                </span>

                <button
                  onClick={() => {
                    if (confirm(`Remove assignment ${asgn.title}?`)) {
                      onDeleteAssignment(asgn.id);
                      sound.playStep();
                    }
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-game mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-400" />
              <span>Create Quest Assignment</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Fraction Adventure"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Question Set</label>
                <select
                  value={selectedSetId}
                  onChange={(e) => setSelectedSetId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                >
                  {questionSets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.questions.length} questions • {s.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Class</label>
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Assign Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
