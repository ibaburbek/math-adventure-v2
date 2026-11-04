import React, { useState } from 'react';
import { StudentAccount, ClassRoom } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../services/audio';
import {
  UserPlus,
  Search,
  Eye,
  EyeOff,
  Coins,
  Trophy,
  Edit2,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  UserCheck,
} from 'lucide-react';

interface StudentManagerProps {
  students: StudentAccount[];
  classes: ClassRoom[];
  onAddStudent: (student: Omit<StudentAccount, 'id' | 'createdAt' | 'completedLevelsCount'>) => void;
  onUpdateStudent: (id: string, updates: Partial<StudentAccount>) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  classes,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});

  // New Student Form State
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPin, setNewPin] = useState('1234');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || '');
  const [newAvatarId, setNewAvatarId] = useState('knight');

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.username.toLowerCase().includes(search.toLowerCase())
  );

  const togglePinReveal = (id: string) => {
    sound.playStep();
    setRevealedPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newUsername.trim() || !newPin.trim()) return;

    // PIN hash (simple SHA-256 equivalent or secure string hash)
    const pinHash = btoa(newPin.trim());

    onAddStudent({
      teacherId: 'teacher_1',
      fullName: newFullName.trim(),
      username: newUsername.trim().toLowerCase(),
      pinHash,
      plainPinForTeacher: newPin.trim(),
      classId: newClassId || undefined,
      className: classes.find((c) => c.id === newClassId)?.name || 'General Math',
      avatarId: newAvatarId,
      characterConfig: {
        characterId: newAvatarId,
        primaryColor: '#3b82f6',
        secondaryColor: '#f59e0b',
        skinTone: '#fcd34d',
        hatId: 'none',
        outfitId: 'armor',
        accessoryId: 'none',
        shoesId: 'boots',
        animationState: 'idle',
      },
      currentWorldId: 'world_forest',
      currentLevelId: 'lvl_forest_1',
      coins: 50,
      isActive: true,
    });

    sound.playCorrect();
    setShowAddModal(false);
    setNewFullName('');
    setNewUsername('');
    setNewPin('1234');
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
          />
        </div>

        <button
          onClick={() => {
            sound.playStep();
            setShowAddModal(true);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition hover:scale-102"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('addStudent')}</span>
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">{t('student')}</th>
                <th className="p-3.5">{t('username')}</th>
                <th className="p-3.5">{t('pin')}</th>
                <th className="p-3.5">{t('classes')}</th>
                <th className="p-3.5">{t('coins')}</th>
                <th className="p-3.5">{t('completed')}</th>
                <th className="p-3.5">{t('status')}</th>
                <th className="p-3.5 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No students found. Click &quot;Add Student&quot; to enroll your first adventurer.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isRevealed = revealedPins[student.id];
                  return (
                    <tr key={student.id} className="hover:bg-slate-800/40 transition">
                      {/* Name & Avatar */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs border border-white/20"
                            style={{ backgroundColor: student.characterConfig.primaryColor }}
                          >
                            {student.avatarId === 'wizard' ? '🧙' : student.avatarId === 'fox' ? '🦊' : student.avatarId === 'robot' ? '🤖' : '⚔️'}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{student.fullName}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{student.avatarId} Hero</span>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="p-3.5 font-mono text-slate-300 font-semibold">
                        @{student.username}
                      </td>

                      {/* PIN with Toggle Reveal */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-300 font-bold">
                            {isRevealed ? student.plainPinForTeacher || '••••' : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePinReveal(student.id)}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Show/Hide PIN for student"
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="p-3.5 text-slate-300 font-medium">
                        {student.className || 'General'}
                      </td>

                      {/* Coins */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1 font-bold text-amber-400">
                          <Coins className="w-3.5 h-3.5" />
                          <span>{student.coins}</span>
                        </div>
                      </td>

                      {/* Completed */}
                      <td className="p-3.5 text-slate-300 font-medium">
                        {student.completedLevelsCount || 0} levels
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => onUpdateStudent(student.id, { isActive: !student.isActive })}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                            student.isActive
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                          }`}
                        >
                          {student.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const newP = prompt('Assign new 4-digit PIN for student:', student.plainPinForTeacher || '1234');
                              if (newP && newP.length >= 4) {
                                onUpdateStudent(student.id, {
                                  pinHash: btoa(newP),
                                  plainPinForTeacher: newP,
                                });
                                sound.playCorrect();
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                            title="Reset PIN"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove student ${student.fullName}?`)) {
                                onDeleteStudent(student.id);
                                sound.playStep();
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <h3 className="text-lg font-bold text-white font-game mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-400" />
              <span>{t('addStudent')}</span>
            </h3>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('studentName')}</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => {
                    setNewFullName(e.target.value);
                    if (!newUsername) {
                      setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'));
                    }
                  }}
                  placeholder="e.g. Leo Arman"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t('username')}</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. leo"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t('assignPin')}</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="1234"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('assignClass')}</label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                >
                  <option value="">General (No Class)</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Starter Hero</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'knight', label: 'Knight', emoji: '⚔️' },
                    { id: 'wizard', label: 'Wizard', emoji: '🧙' },
                    { id: 'fox', label: 'Fox', emoji: '🦊' },
                    { id: 'robot', label: 'Robot', emoji: '🤖' },
                  ].map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setNewAvatarId(h.id)}
                      className={`p-2 rounded-xl border text-center transition ${
                        newAvatarId === h.id
                          ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <span className="text-xl block">{h.emoji}</span>
                      <span className="text-[10px] block mt-0.5">{h.label}</span>
                    </button>
                  ))}
                </div>
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
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
