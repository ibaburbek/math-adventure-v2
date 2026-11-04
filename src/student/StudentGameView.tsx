import React, { useState } from 'react';
import {
  StudentAccount,
  World,
  Level,
  StudentProgress,
  ShopItem,
  CharacterConfig,
} from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { GameMap2D } from '../map/GameMap2D';
import { Character3DViewer } from '../characters/Character3DViewer';
import { QuestionModal } from './QuestionModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { WorldSelectorModal } from './WorldSelectorModal';
import { LevelSelectorModal } from './LevelSelectorModal';
import { LeaderboardModal } from './LeaderboardModal';
import { ShopModal } from '../shop/ShopModal';
import { CharacterCustomizer } from '../characters/CharacterCustomizer';
import { sound } from '../services/audio';
import {
  Coins,
  ShoppingBag,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Globe,
  Settings,
  ChevronDown,
  User,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface StudentGameViewProps {
  student: StudentAccount;
  worlds: World[];
  currentWorld: World;
  levels: Level[];
  currentLevel: Level;
  progress: StudentProgress;
  allProgress: Record<string, StudentProgress>;
  allStudents: StudentAccount[];
  shopItems: ShopItem[];
  inventoryItemIds: string[];
  onSelectWorld: (worldId: string) => void;
  onSelectLevel: (levelId: string) => void;
  onAdvanceTile: (levelId: string, tileIndex: number, coinsEarned: number) => void;
  onSaveCharacterConfig: (newConfig: CharacterConfig) => void;
  onBuyShopItem: (item: ShopItem) => boolean;
  onEquipShopItem: (item: ShopItem) => void;
  onSwitchToTeacherView: () => void;
  onLogout: () => void;
}

export const StudentGameView: React.FC<StudentGameViewProps> = ({
  student,
  worlds,
  currentWorld,
  levels,
  currentLevel,
  progress,
  allProgress,
  allStudents,
  shopItems,
  inventoryItemIds,
  onSelectWorld,
  onSelectLevel,
  onAdvanceTile,
  onSaveCharacterConfig,
  onBuyShopItem,
  onEquipShopItem,
  onSwitchToTeacherView,
  onLogout,
}) => {
  const { t, language, setLanguage } = useLanguage();

  // Active Modals state
  const [activeQuestionTile, setActiveQuestionTile] = useState<number | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState<boolean>(false);
  const [showWorldSelector, setShowWorldSelector] = useState<boolean>(false);
  const [showLevelSelector, setShowLevelSelector] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showShop, setShowShop] = useState<boolean>(false);
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted());

  const handleTileClick = (tileIndex: number) => {
    sound.playStep();
    setActiveQuestionTile(tileIndex);
  };

  const handleAnswerSubmit = (isCorrect: boolean, coinReward: number, manualText?: string) => {
    if (activeQuestionTile === null) return;

    if (isCorrect) {
      // Advance 1 tile forward and award coins!
      onAdvanceTile(currentLevel.id, activeQuestionTile, coinReward);

      // If finished last tile in level, trigger Level Complete celebration!
      const totalTiles = currentLevel.totalTiles || 10;
      if (activeQuestionTile >= totalTiles - 1) {
        setTimeout(() => {
          setShowLevelComplete(true);
        }, 1200);
      }
    }
  };

  const toggleSound = () => {
    const nextState = sound.toggleMute();
    setIsMuted(nextState);
  };

  const currentTileNumber = progress.currentTile;
  const currentQuestion = currentLevel.questions[activeQuestionTile ?? 0] || currentLevel.questions[0];

  // Check if current level has a next level
  const currentLevelIndex = levels.findIndex((l) => l.id === currentLevel.id);
  const hasNextLevel = currentLevelIndex >= 0 && currentLevelIndex < levels.length - 1;

  const handleNextLevel = () => {
    if (hasNextLevel) {
      const nextLvl = levels[currentLevelIndex + 1];
      onSelectLevel(nextLvl.id);
      setShowLevelComplete(false);
      setActiveQuestionTile(null);
    }
  };

  const handleReplayLevel = () => {
    setShowLevelComplete(false);
    setActiveQuestionTile(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Navbar HUD */}
      <header className="relative z-30 px-4 md:px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex items-center justify-between gap-3 shadow-xl">
        {/* Left: Hero info & Student Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playStep();
              setShowCustomizer(true);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400/50 transition group shadow"
            title={t('customizeCharacter')}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs border border-white/20 shadow-inner group-hover:scale-105 transition-transform"
              style={{ backgroundColor: student.characterConfig.primaryColor }}
            >
              {student.characterConfig.characterId === 'wizard' ? '🧙' : student.characterConfig.characterId === 'fox' ? '🦊' : student.characterConfig.characterId === 'robot' ? '🤖' : '⚔️'}
            </div>
            <div className="text-left">
              <span className="font-black text-xs text-white block font-game group-hover:text-amber-300">
                {student.fullName}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {t('customizeCharacter')}
              </span>
            </div>
          </button>
        </div>

        {/* Center / Right: Coins, Shop, Leaderboard, Audio, Language */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Coin Pouch */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-amber-400 font-black text-xs md:text-sm shadow-inner">
            <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{student.coins}</span>
          </div>

          {/* Hero Shop Button */}
          <button
            onClick={() => {
              sound.playStep();
              setShowShop(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 transition hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">{t('shop')}</span>
          </button>

          {/* Class Leaderboard Button */}
          <button
            onClick={() => {
              sound.playStep();
              setShowLeaderboard(true);
            }}
            className="p-2 md:px-3 md:py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition"
            title={t('viewLeaderboard')}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">{t('viewLeaderboard')}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-slate-400 hover:text-white transition"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-2xl p-0.5 text-xs font-bold">
            {(['kk', 'ru', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  sound.playStep();
                  setLanguage(lang);
                }}
                className={`px-2 py-1 rounded-xl uppercase transition ${
                  language === lang
                    ? 'bg-indigo-600 text-white shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Quick Switch to Teacher View (or Logout) */}
          <button
            onClick={onSwitchToTeacherView}
            className="p-2 md:px-3 md:py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-2xl text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition flex items-center gap-1.5"
            title="Switch to Teacher Dashboard"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">{t('teacher')}</span>
          </button>
        </div>
      </header>

      {/* Main Game Screen: Split 3D Hero Companion + 2D Adventure Board Map */}
      <main className="flex-1 p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-7xl mx-auto w-full">
        {/* Left Column: 3D Animated Hero Companion Widget */}
        <div className="lg:col-span-3 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between order-2 lg:order-1 min-h-[280px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                3D Hero Companion
              </span>
              <span className="text-[10px] text-slate-500">Drag to rotate</span>
            </div>

            {/* 3D Character Canvas */}
            <div className="w-full h-48 md:h-56 relative flex items-center justify-center">
              <Character3DViewer
                config={student.characterConfig}
                autoRotate={false}
                interactive={true}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                sound.playStep();
                setShowCustomizer(true);
              }}
              className="w-full py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('customizeCharacter')}</span>
            </button>

            <button
              onClick={() => {
                sound.playStep();
                setShowShop(true);
              }}
              className="w-full py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('shop')}</span>
            </button>
          </div>
        </div>

        {/* Central / Right: 2D Fantasy Adventure Map */}
        <div className="lg:col-span-9 order-1 lg:order-2 flex flex-col h-full min-h-[520px]">
          <GameMap2D
            world={currentWorld}
            level={currentLevel}
            progress={progress}
            characterConfig={student.characterConfig}
            onTileClick={handleTileClick}
            onLevelSelectClick={() => {
              sound.playStep();
              setShowLevelSelector(true);
            }}
            onWorldSelectClick={() => {
              sound.playStep();
              setShowWorldSelector(true);
            }}
          />
        </div>
      </main>

      {/* Active Modals */}

      {/* 1. Question Modal */}
      {activeQuestionTile !== null && (
        <QuestionModal
          question={currentLevel.questions[activeQuestionTile] || currentLevel.questions[0]}
          tileIndex={activeQuestionTile}
          totalTiles={currentLevel.totalTiles || 10}
          alreadySolved={
            progress.currentTile > activeQuestionTile ||
            progress.completedTiles.includes(activeQuestionTile)
          }
          onAnswerSubmit={handleAnswerSubmit}
          onClose={() => setActiveQuestionTile(null)}
        />
      )}

      {/* 2. Level Complete Modal */}
      {showLevelComplete && (
        <LevelCompleteModal
          levelNumber={currentLevel.levelNumber}
          worldName={currentWorld.name[language]}
          totalCoinsEarned={currentLevel.questions.reduce((a, q) => a + q.coinReward, 0)}
          stars={3}
          hasNextLevel={hasNextLevel}
          onNextLevel={handleNextLevel}
          onReplay={handleReplayLevel}
          onClose={() => setShowLevelComplete(false)}
        />
      )}

      {/* 3. World Selector Modal */}
      {showWorldSelector && (
        <WorldSelectorModal
          worlds={worlds}
          currentWorldId={currentWorld.id}
          onSelectWorld={(wId) => {
            onSelectWorld(wId);
            setShowWorldSelector(false);
          }}
          onClose={() => setShowWorldSelector(false)}
        />
      )}

      {/* 4. Level Selector Modal */}
      {showLevelSelector && (
        <LevelSelectorModal
          levels={levels}
          currentLevelId={currentLevel.id}
          allProgress={allProgress}
          onSelectLevel={(lId) => {
            onSelectLevel(lId);
            setShowLevelSelector(false);
          }}
          onClose={() => setShowLevelSelector(false)}
        />
      )}

      {/* 5. Hero Shop Modal */}
      {showShop && (
        <ShopModal
          coins={student.coins}
          inventoryItemIds={inventoryItemIds}
          characterConfig={student.characterConfig}
          shopItems={shopItems}
          onBuyItem={onBuyShopItem}
          onEquipItem={onEquipShopItem}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* 6. Hero 3D Customizer Modal */}
      {showCustomizer && (
        <CharacterCustomizer
          currentConfig={student.characterConfig}
          unlockedItems={shopItems.filter((i) => inventoryItemIds.includes(i.id))}
          onSave={onSaveCharacterConfig}
          onClose={() => setShowCustomizer(false)}
        />
      )}

      {/* 7. Class Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          students={allStudents}
          currentStudentId={student.id}
          className={student.className}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
};
