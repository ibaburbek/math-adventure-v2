import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import {
  StudentAccount,
  World,
  Level,
  StudentProgress,
  UserRole,
  ShopItem,
  CharacterConfig,
} from './types';
import {
  gameStore,
  SEED_WORLDS,
  SEED_LEVELS,
} from './services/store';
import { INITIAL_SHOP_ITEMS } from './characters/characterPresets';
import { StudentGameView } from './student/StudentGameView';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { AuthModal } from './components/AuthModal';
import { sound } from './services/audio';

function MathAdventureApp() {
  const { t } = useLanguage();

  // Store synchronization tick
  const [, setStoreTick] = useState(0);
  useEffect(() => {
    return gameStore.subscribe(() => setStoreTick((prev) => prev + 1));
  }, []);

  // State
  const [role, setRole] = useState<UserRole>('student');
  const [currentStudentId, setCurrentStudentId] = useState<string>('student_leo');
  const [currentWorldId, setCurrentWorldId] = useState<string>('world_forest');
  const [currentLevelId, setCurrentLevelId] = useState<string>('lvl_forest_1');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('student');

  const students = gameStore.getStudents();
  const classes = gameStore.getClasses();
  const questionSets = gameStore.getQuestionSets();
  const assignments = gameStore.getAssignments();
  const submissions = gameStore.getSubmissions();

  // Current active student
  const currentStudent =
    students.find((s) => s.id === currentStudentId) || students[0] || {
      id: 'student_leo',
      teacherId: 'teacher_1',
      username: 'leo',
      pinHash: btoa('1234'),
      fullName: 'Leo the Knight',
      avatarId: 'knight',
      characterConfig: {
        characterId: 'knight',
        primaryColor: '#3b82f6',
        secondaryColor: '#f59e0b',
        skinTone: '#fcd34d',
        hatId: 'helm',
        outfitId: 'armor',
        accessoryId: 'shield',
        shoesId: 'boots',
        animationState: 'idle',
      },
      currentWorldId: 'world_forest',
      currentLevelId: 'lvl_forest_1',
      coins: 70,
      isActive: true,
      createdAt: new Date().toISOString(),
      completedLevelsCount: 1,
    };

  // Current World & Levels
  const currentWorld =
    SEED_WORLDS.find((w) => w.id === currentWorldId) || SEED_WORLDS[0];

  const levelsInWorld = SEED_LEVELS.filter((l) => l.worldId === currentWorldId);
  const currentLevel =
    levelsInWorld.find((l) => l.id === currentLevelId) ||
    levelsInWorld[0] ||
    SEED_LEVELS[0];

  const progress = gameStore.getStudentProgress(currentStudent.id, currentLevel.id);
  const allProgress = gameStore.getAllProgressForStudent(currentStudent.id);
  const inventoryItemIds = gameStore.getStudentInventory(currentStudent.id);

  // Handlers
  const handleSelectWorld = (worldId: string) => {
    setCurrentWorldId(worldId);
    const firstLevel = SEED_LEVELS.find((l) => l.worldId === worldId);
    if (firstLevel) {
      setCurrentLevelId(firstLevel.id);
    }
  };

  const handleSelectLevel = (levelId: string) => {
    setCurrentLevelId(levelId);
  };

  const handleAdvanceTile = (levelId: string, tileIndex: number, coinsEarned: number) => {
    gameStore.advanceStudentTile(currentStudent.id, levelId, tileIndex, coinsEarned);
  };

  const handleSaveCharacterConfig = (newConfig: CharacterConfig) => {
    gameStore.updateStudent(currentStudent.id, { characterConfig: newConfig });
  };

  const handleBuyShopItem = (item: ShopItem): boolean => {
    return gameStore.buyShopItem(currentStudent.id, item);
  };

  const handleEquipShopItem = (item: ShopItem) => {
    gameStore.equipShopItem(currentStudent.id, item);
  };

  // Auth Handlers
  const handleLoginStudent = (username: string, pin: string): boolean => {
    const student = students.find(
      (s) =>
        s.username.toLowerCase() === username.toLowerCase() &&
        (s.pinHash === btoa(pin) || s.plainPinForTeacher === pin)
    );
    if (student) {
      setCurrentStudentId(student.id);
      setRole('student');
      setShowAuthModal(false);
      return true;
    }
    return false;
  };

  const handleLoginTeacher = (username: string, pin: string): boolean => {
    if (
      (username.toLowerCase() === 'teacher' || username.toLowerCase() === 'admin') &&
      pin === '1234'
    ) {
      setRole('teacher');
      setShowAuthModal(false);
      return true;
    }
    return false;
  };

  const handleRegisterTeacher = (username: string, pin: string, fullName: string): boolean => {
    setRole('teacher');
    setShowAuthModal(false);
    return true;
  };

  const handleSwitchToTeacher = () => {
    sound.playStep();
    setRole('teacher');
  };

  const handleSwitchToStudent = () => {
    sound.playStep();
    setRole('student');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {role === 'student' ? (
        <StudentGameView
          student={currentStudent}
          worlds={SEED_WORLDS}
          currentWorld={currentWorld}
          levels={levelsInWorld}
          currentLevel={currentLevel}
          progress={progress}
          allProgress={allProgress}
          allStudents={students}
          shopItems={INITIAL_SHOP_ITEMS}
          inventoryItemIds={inventoryItemIds}
          onSelectWorld={handleSelectWorld}
          onSelectLevel={handleSelectLevel}
          onAdvanceTile={handleAdvanceTile}
          onSaveCharacterConfig={handleSaveCharacterConfig}
          onBuyShopItem={handleBuyShopItem}
          onEquipShopItem={handleEquipShopItem}
          onSwitchToTeacherView={handleSwitchToTeacher}
          onLogout={() => {
            setAuthDefaultRole('student');
            setShowAuthModal(true);
          }}
        />
      ) : (
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          <TeacherDashboard
            students={students}
            classes={classes}
            questionSets={questionSets}
            assignments={assignments}
            submissions={submissions}
            onAddStudent={(s) => gameStore.addStudent(s)}
            onUpdateStudent={(id, u) => gameStore.updateStudent(id, u)}
            onDeleteStudent={(id) => gameStore.deleteStudent(id)}
            onCreateClass={(c) => gameStore.addClass(c)}
            onDeleteClass={(id) => gameStore.deleteClass(id)}
            onCreateSet={(s) => gameStore.addQuestionSet(s)}
            onUpdateSet={(id, u) => gameStore.updateQuestionSet(id, u)}
            onDeleteSet={(id) => gameStore.deleteQuestionSet(id)}
            onAssignSet={(qId, cId, sIds) => {
              const qSet = questionSets.find((s) => s.id === qId);
              gameStore.addAssignment({
                teacherId: 'teacher_1',
                title: `${qSet?.title || 'Math Quest'} Assignment`,
                questionSetId: qId,
                classId: cId,
                studentIds: sIds,
                dueDate: '2026-11-20',
              });
            }}
            onCreateAssignment={(a) => gameStore.addAssignment(a)}
            onDeleteAssignment={(id) => gameStore.deleteAssignment(id)}
            onReviewSubmission={(id, status, feedback) =>
              gameStore.reviewSubmission(id, status, feedback)
            }
            onResetSeedData={() => gameStore.resetToDefaults()}
            onSwitchToStudentView={handleSwitchToStudent}
          />
        </div>
      )}

      {/* Auth Modal when triggered */}
      {showAuthModal && (
        <AuthModal
          defaultRole={authDefaultRole}
          onLoginTeacher={handleLoginTeacher}
          onLoginStudent={handleLoginStudent}
          onRegisterTeacher={handleRegisterTeacher}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MathAdventureApp />
    </LanguageProvider>
  );
}
