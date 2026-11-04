import React, { useState } from 'react';
import {
  StudentAccount,
  ClassRoom,
  QuestionSet,
  Assignment,
  ManualSubmission,
  Question,
} from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { StudentManager } from './StudentManager';
import { ClassManager } from './ClassManager';
import { QuestionBank } from './QuestionBank';
import { AssignmentManager } from './AssignmentManager';
import { ManualReviewQueue } from './ManualReviewQueue';
import { DbSettingsModal } from './DbSettingsModal';
import { sound } from '../services/audio';
import {
  LayoutDashboard,
  Users,
  School,
  BookOpen,
  Send,
  Clock,
  BarChart3,
  Database,
  Coins,
  Trophy,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface TeacherDashboardProps {
  students: StudentAccount[];
  classes: ClassRoom[];
  questionSets: QuestionSet[];
  assignments: Assignment[];
  submissions: ManualSubmission[];
  onAddStudent: (s: Omit<StudentAccount, 'id' | 'createdAt' | 'completedLevelsCount'>) => void;
  onUpdateStudent: (id: string, updates: Partial<StudentAccount>) => void;
  onDeleteStudent: (id: string) => void;
  onCreateClass: (c: Omit<ClassRoom, 'id' | 'createdAt' | 'studentCount'>) => void;
  onDeleteClass: (id: string) => void;
  onCreateSet: (s: Omit<QuestionSet, 'id' | 'createdAt'>) => void;
  onUpdateSet: (id: string, updates: Partial<QuestionSet>) => void;
  onDeleteSet: (id: string) => void;
  onAssignSet: (questionSetId: string, classId?: string, studentIds?: string[]) => void;
  onCreateAssignment: (a: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onDeleteAssignment: (id: string) => void;
  onReviewSubmission: (id: string, status: 'approved' | 'rejected', feedback?: string) => void;
  onResetSeedData: () => void;
  onSwitchToStudentView: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  classes,
  questionSets,
  assignments,
  submissions,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onCreateClass,
  onDeleteClass,
  onCreateSet,
  onUpdateSet,
  onDeleteSet,
  onAssignSet,
  onCreateAssignment,
  onDeleteAssignment,
  onReviewSubmission,
  onResetSeedData,
  onSwitchToStudentView,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'students' | 'classes' | 'questions' | 'assignments' | 'reviews' | 'analytics'
  >('overview');
  const [showDbModal, setShowDbModal] = useState(false);

  // Metrics calculation
  const totalStudents = students.length;
  const activeAssignments = assignments.length;
  const completedLevelsTotal = students.reduce((acc, s) => acc + (s.completedLevelsCount || 0), 0);
  const pendingReviews = submissions.filter((s) => s.status === 'pending').length;
  const totalCoinsInCirculation = students.reduce((acc, s) => acc + s.coins, 0);

  const tabs: Array<{
    id: typeof activeTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    { id: 'overview', label: t('dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: t('students'), icon: <Users className="w-4 h-4" />, badge: totalStudents },
    { id: 'classes', label: t('classes'), icon: <School className="w-4 h-4" /> },
    { id: 'questions', label: t('questionBank'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'assignments', label: t('assignments'), icon: <Send className="w-4 h-4" />, badge: activeAssignments },
    { id: 'reviews', label: t('manualReviews'), icon: <Clock className="w-4 h-4" />, badge: pendingReviews },
    { id: 'analytics', label: t('analytics'), icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl text-slate-950 shadow-xl shadow-indigo-600/20">
            <GraduationCap className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white font-game flex items-center gap-2">
              <span>{t('teacherPortal')}</span>
            </h1>
            <p className="text-xs text-slate-400">
              Manage curricula, mathematical quests, classroom rosters, and student grading
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-stretch md:self-auto">
          <button
            onClick={() => {
              sound.playStep();
              setShowDbModal(true);
            }}
            className="px-3.5 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Database</span>
          </button>

          <button
            onClick={onSwitchToStudentView}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition hover:scale-102"
          >
            <span>Play As Student</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playStep();
              setActiveTab(tab.id);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {Boolean(tab.badge) && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  tab.id === 'reviews'
                    ? 'bg-rose-500 text-white'
                    : activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">{t('totalStudents')}</span>
                <span className="text-2xl font-black text-white mt-1 block">{totalStudents}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">{t('activeAssignments')}</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">{activeAssignments}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Send className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">{t('completedLevels')}</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">{completedLevelsTotal}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Trophy className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">{t('pendingReviews')}</span>
                <span className="text-2xl font-black text-rose-400 mt-1 block">{pendingReviews}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Roster & Quest Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top performing students */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm font-game">Top Student Adventurers</h3>
                <button
                  onClick={() => setActiveTab('students')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  View All Rosters →
                </button>
              </div>

              <div className="space-y-2.5">
                {[...students]
                  .sort((a, b) => b.coins - a.coins)
                  .slice(0, 4)
                  .map((student, i) => (
                    <div
                      key={student.id}
                      className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-bold font-mono text-xs text-slate-500">
                          #{i + 1}
                        </span>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: student.characterConfig.primaryColor }}
                        >
                          {student.avatarId === 'wizard' ? '🧙' : student.avatarId === 'robot' ? '🤖' : '⚔️'}
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">{student.fullName}</span>
                          <span className="text-[10px] text-slate-400">
                            {student.className || 'General'} • {student.completedLevelsCount} levels completed
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{student.coins}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Action Tasks */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-sm font-game mb-3">Teacher Action Center</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-rose-400" />
                      <span className="text-xs text-slate-300 group-hover:text-white font-semibold">
                        Grade Pending Solutions
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300">
                      {pendingReviews}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('questions')}
                    className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs text-slate-300 group-hover:text-white font-semibold">
                        Manage Question Bank
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {questionSets.length} Sets
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('students')}
                    className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-slate-300 group-hover:text-white font-semibold">
                        Enroll New Student
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 mt-4">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {totalCoinsInCirculation} Total coins awarded to students
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Students */}
      {activeTab === 'students' && (
        <StudentManager
          students={students}
          classes={classes}
          onAddStudent={onAddStudent}
          onUpdateStudent={onUpdateStudent}
          onDeleteStudent={onDeleteStudent}
        />
      )}

      {/* Tab 3: Classes */}
      {activeTab === 'classes' && (
        <ClassManager
          classes={classes}
          students={students}
          onCreateClass={onCreateClass}
          onDeleteClass={onDeleteClass}
        />
      )}

      {/* Tab 4: Question Bank */}
      {activeTab === 'questions' && (
        <QuestionBank
          questionSets={questionSets}
          classes={classes}
          students={students}
          onCreateSet={onCreateSet}
          onUpdateSet={onUpdateSet}
          onDeleteSet={onDeleteSet}
          onAssignSet={onAssignSet}
        />
      )}

      {/* Tab 5: Assignments */}
      {activeTab === 'assignments' && (
        <AssignmentManager
          assignments={assignments}
          questionSets={questionSets}
          classes={classes}
          onCreateAssignment={onCreateAssignment}
          onDeleteAssignment={onDeleteAssignment}
        />
      )}

      {/* Tab 6: Manual Reviews */}
      {activeTab === 'reviews' && (
        <ManualReviewQueue
          submissions={submissions}
          onReview={onReviewSubmission}
        />
      )}

      {/* Tab 7: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base font-game flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>Topic-Level Mathematical Mastery</span>
            </h3>

            <div className="space-y-3">
              {[
                { topic: 'Fractions & Ratios', accuracy: 88, count: 42, color: 'bg-emerald-500' },
                { topic: 'Geometry & Angles', accuracy: 76, count: 28, color: 'bg-amber-500' },
                { topic: 'Linear Equations & Logic', accuracy: 69, count: 35, color: 'bg-indigo-500' },
                { topic: 'Powers & Roots', accuracy: 82, count: 20, color: 'bg-teal-500' },
              ].map((item) => (
                <div key={item.topic} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-white">{item.topic}</span>
                    <span className="text-slate-300 font-mono">{item.accuracy}% accuracy ({item.count} attempts)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Supabase Database Settings Modal */}
      {showDbModal && (
        <DbSettingsModal
          onResetSeedData={onResetSeedData}
          onClose={() => setShowDbModal(false)}
        />
      )}
    </div>
  );
};
