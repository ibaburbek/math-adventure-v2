import React, { useState } from 'react';
import { ClassRoom, StudentAccount } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../services/audio';
import { School, Plus, Users, Trophy, Trash2, BookOpen } from 'lucide-react';

interface ClassManagerProps {
  classes: ClassRoom[];
  students: StudentAccount[];
  onCreateClass: (c: Omit<ClassRoom, 'id' | 'createdAt' | 'studentCount'>) => void;
  onDeleteClass: (id: string) => void;
}

export const ClassManager: React.FC<ClassManagerProps> = ({
  classes,
  students,
  onCreateClass,
  onDeleteClass,
}) => {
  const { t } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Grade 4');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateClass({
      teacherId: 'teacher_1',
      name: name.trim(),
      grade: grade.trim(),
      description: description.trim(),
    });

    sound.playCorrect();
    setShowAddModal(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white font-game">{t('classes')}</h3>
          <p className="text-xs text-slate-400">Organize student groups, leaderboards, and class-wide quests</p>
        </div>

        <button
          onClick={() => {
            sound.playStep();
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition hover:scale-102"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('addClass')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const classStudents = students.filter((s) => s.classId === cls.id);
          const totalCoins = classStudents.reduce((acc, s) => acc + s.coins, 0);

          return (
            <div
              key={cls.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <School className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                    {cls.grade}
                  </span>
                </div>

                <h4 className="font-bold text-white text-base mb-1">{cls.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                  {cls.description || 'Dedicated mathematics squad for quest adventures.'}
                </p>

                <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Enrolled</span>
                    <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      {classStudents.length} Students
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Coins</span>
                    <span className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      {totalCoins}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  ID: {cls.id.slice(0, 8)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete class ${cls.name}?`)) {
                      onDeleteClass(cls.id);
                      sound.playStep();
                    }
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  title="Delete Class"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-game mb-4 flex items-center gap-2">
              <School className="w-5 h-5 text-amber-400" />
              <span>{t('addClass')}</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('className')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grade 4 Math Champions"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('grade')}</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                >
                  <option value="Grade 3">Grade 3 (Ages 8-9)</option>
                  <option value="Grade 4">Grade 4 (Ages 9-10)</option>
                  <option value="Grade 5">Grade 5 (Ages 10-11)</option>
                  <option value="Grade 6">Grade 6 (Ages 11-12)</option>
                  <option value="Grade 7">Grade 7 (Ages 12-13)</option>
                  <option value="Grade 8">Grade 8 (Ages 13-14)</option>
                  <option value="Grade 9">Grade 9 (Ages 14-15)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Class objectives, curriculum topics..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
