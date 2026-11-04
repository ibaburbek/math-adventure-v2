import React, { useMemo } from 'react';
import { World, Level, StudentProgress, CharacterConfig } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Sparkles, Trophy, Lock, CheckCircle2, ChevronRight, MapPin, Compass } from 'lucide-react';

interface GameMap2DProps {
  world: World;
  level: Level;
  progress: StudentProgress;
  characterConfig: CharacterConfig;
  onTileClick: (tileIndex: number) => void;
  onLevelSelectClick: () => void;
  onWorldSelectClick: () => void;
}

export const GameMap2D: React.FC<GameMap2DProps> = ({
  world,
  level,
  progress,
  characterConfig,
  onTileClick,
  onLevelSelectClick,
  onWorldSelectClick,
}) => {
  const { t, language } = useLanguage();
  const totalTiles = level.totalTiles || 10;
  const currentTile = progress.currentTile; // 0-indexed: current active step

  // Generate a serpentine winding 2D board-game path with coordinates (percentage x, y)
  const pathNodes = useMemo(() => {
    const nodes: Array<{
      index: number;
      x: number;
      y: number;
      label: number;
    }> = [];

    // Serpentine curve: S-shape layout from bottom-left to top-right
    // row 0 (bottom): left to right (tiles 0, 1, 2)
    // row 1 (mid-low): right to left (tiles 3, 4, 5)
    // row 2 (mid-high): left to right (tiles 6, 7, 8)
    // row 3 (top): right to left (tile 9 -> Finish)

    const coords = [
      { x: 12, y: 84 }, // Tile 0 (Start)
      { x: 30, y: 82 }, // Tile 1
      { x: 50, y: 78 }, // Tile 2
      { x: 72, y: 80 }, // Tile 3
      { x: 88, y: 66 }, // Tile 4 (Bend up)
      { x: 68, y: 55 }, // Tile 5
      { x: 44, y: 52 }, // Tile 6
      { x: 22, y: 44 }, // Tile 7 (Bend up)
      { x: 38, y: 28 }, // Tile 8
      { x: 65, y: 22 }, // Tile 9
      { x: 86, y: 15 }, // Finish (Chest)
    ];

    for (let i = 0; i < totalTiles; i++) {
      const pos = coords[i] || { x: 10 + (i * 8), y: 85 - (i * 7) };
      nodes.push({
        index: i,
        x: pos.x,
        y: pos.y,
        label: i + 1,
      });
    }

    return nodes;
  }, [totalTiles]);

  // World Theme Visual Tokens
  const worldThemes: Record<
    World['theme'],
    {
      bgGradient: string;
      pathColor: string;
      activeTileBg: string;
      completedTileBg: string;
      terrainElements: React.ReactNode;
    }
  > = {
    forest: {
      bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
      pathColor: 'stroke-amber-600/60',
      activeTileBg: 'bg-gradient-to-tr from-amber-400 to-amber-200 border-amber-300 text-slate-950',
      completedTileBg: 'bg-emerald-600 border-emerald-400 text-white',
      terrainElements: (
        <>
          {/* Procedural SVG Forest Foliage & Magical Mushrooms */}
          <g className="opacity-70">
            {/* Ancient Trees */}
            <circle cx="10%" cy="20%" r="45" fill="#064e3b" />
            <circle cx="8%" cy="18%" r="35" fill="#047857" />
            <circle cx="92%" cy="40%" r="55" fill="#064e3b" />
            <circle cx="94%" cy="38%" r="40" fill="#059669" />
            <circle cx="15%" cy="65%" r="35" fill="#047857" />
            {/* Glowing Mushroom clusters */}
            <circle cx="25%" cy="92%" r="8" fill="#ec4899" className="animate-pulse" />
            <circle cx="75%" cy="48%" r="10" fill="#a855f7" className="animate-pulse" />
            <circle cx="48%" cy="35%" r="7" fill="#38bdf8" />
            {/* River Bridge */}
            <path
              d="M 0 350 Q 300 380 500 520 T 1000 650"
              fill="none"
              stroke="#0284c7"
              strokeWidth="28"
              opacity="0.3"
            />
          </g>
        </>
      ),
    },
    desert: {
      bgGradient: 'from-amber-950 via-orange-950 to-slate-950',
      pathColor: 'stroke-amber-500/50',
      activeTileBg: 'bg-gradient-to-tr from-amber-400 to-yellow-200 border-yellow-300 text-slate-950',
      completedTileBg: 'bg-amber-600 border-amber-400 text-white',
      terrainElements: (
        <>
          <g className="opacity-60">
            {/* Pyramids */}
            <polygon points="120,180 60,280 180,280" fill="#78350f" />
            <polygon points="120,180 180,280 230,280" fill="#92400e" />
            <polygon points="850,220 780,320 920,320" fill="#78350f" />
            {/* Oasis Water */}
            <ellipse cx="60%" cy="70%" rx="90" ry="40" fill="#0284c7" opacity="0.4" />
            {/* Sand dunes */}
            <path
              d="M 0 450 Q 250 400 500 460 T 1000 480"
              fill="none"
              stroke="#b45309"
              strokeWidth="16"
              opacity="0.35"
            />
          </g>
        </>
      ),
    },
    ice: {
      bgGradient: 'from-sky-950 via-blue-950 to-slate-950',
      pathColor: 'stroke-cyan-400/50',
      activeTileBg: 'bg-gradient-to-tr from-cyan-300 to-white border-cyan-200 text-slate-950',
      completedTileBg: 'bg-cyan-600 border-cyan-400 text-white',
      terrainElements: (
        <>
          <g className="opacity-65">
            {/* Ice Peaks */}
            <polygon points="180,100 100,280 260,280" fill="#0c4a6e" />
            <polygon points="180,100 260,280 320,280" fill="#0284c7" />
            <polygon points="180,100 160,160 200,160" fill="#e0f2fe" />
            <polygon points="780,80 700,240 860,240" fill="#0369a1" />
            {/* Ice crystals */}
            <circle cx="85%" cy="60%" r="14" fill="#67e8f9" opacity="0.7" className="animate-pulse" />
            <circle cx="20%" cy="50%" r="10" fill="#bae6fd" opacity="0.8" />
          </g>
        </>
      ),
    },
    castle: {
      bgGradient: 'from-purple-950 via-indigo-950 to-slate-950',
      pathColor: 'stroke-indigo-400/60',
      activeTileBg: 'bg-gradient-to-tr from-purple-400 to-amber-200 border-purple-300 text-slate-950',
      completedTileBg: 'bg-purple-600 border-purple-400 text-white',
      terrainElements: (
        <>
          <g className="opacity-70">
            {/* Floating Castle Towers */}
            <rect x="80" y="80" width="70" height="150" fill="#3b0764" rx="10" />
            <polygon points="115,30 70,80 160,80" fill="#581c87" />
            <rect x="800" y="60" width="85" height="180" fill="#3b0764" rx="10" />
            <polygon points="842,10 790,60 895,60" fill="#7e22ce" />
            {/* Floating Magic Portals */}
            <ellipse cx="50%" cy="16%" rx="60" ry="25" fill="#a855f7" opacity="0.5" className="animate-pulse" />
          </g>
        </>
      ),
    },
  };

  const themeConfig = worldThemes[world.theme] || worldThemes.forest;

  // Build SVG path curve between nodes
  const svgPathString = useMemo(() => {
    if (pathNodes.length < 2) return '';
    let d = `M ${pathNodes[0].x * 10} ${pathNodes[0].y * 8}`;
    for (let i = 1; i < pathNodes.length; i++) {
      const prev = pathNodes[i - 1];
      const curr = pathNodes[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      d += ` Q ${prev.x * 10} ${curr.y * 8}, ${curr.x * 10} ${curr.y * 8}`;
    }
    return d;
  }, [pathNodes]);

  return (
    <div className="relative w-full h-full min-h-[580px] md:min-h-[680px] rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl flex flex-col justify-between select-none">
      {/* Background Gradient & SVG Landscape */}
      <div className={`absolute inset-0 bg-gradient-to-b ${themeConfig.bgGradient} transition-colors duration-700`}>
        <svg
          viewBox="0 0 1000 800"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {themeConfig.terrainElements}

          {/* Dotted Trail Path */}
          <path
            d={svgPathString}
            fill="none"
            className={themeConfig.pathColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="8 14"
          />

          {/* Glowing active progression line */}
          <path
            d={svgPathString}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Top Map HUD: World & Level Breadcrumbs */}
      <div className="relative z-20 p-4 md:p-6 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-slate-950/80 to-transparent">
        <div className="flex items-center gap-2">
          {/* World Selector Button */}
          <button
            onClick={onWorldSelectClick}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-xs md:text-sm font-bold text-white shadow-lg transition hover:scale-102"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{world.name[language]}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Level Selector Button */}
          <button
            onClick={onLevelSelectClick}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 rounded-2xl text-xs md:text-sm font-bold text-indigo-200 shadow-lg transition hover:scale-102"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>{level.title[language]}</span>
          </button>
        </div>

        {/* Progress pill: "Step X of 10" */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-inner text-xs font-semibold">
          <span className="text-slate-400">{t('tile')}:</span>
          <span className="text-amber-400 font-bold font-mono">
            {Math.min(currentTile + 1, totalTiles)} / {totalTiles}
          </span>
          <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${(Math.min(currentTile, totalTiles) / totalTiles) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2D Interactive Board Tiles */}
      <div className="relative z-10 flex-1 w-full h-full">
        {pathNodes.map((node) => {
          const isCompleted = currentTile > node.index || progress.completedTiles.includes(node.index);
          const isCurrent = currentTile === node.index;
          const isLocked = currentTile < node.index;
          const isFinishTile = node.index === totalTiles - 1;

          return (
            <div
              key={node.index}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 flex flex-col items-center"
            >
              {/* If player character is on this tile, render the player indicator with character head & name */}
              {isCurrent && (
                <div className="absolute -top-16 flex flex-col items-center animate-bounce z-30 pointer-events-none">
                  <div className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[11px] rounded-full shadow-lg border border-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    <span>YOU</span>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full border-2 border-amber-400 shadow-xl flex items-center justify-center font-bold text-white text-xs mt-1"
                    style={{ backgroundColor: characterConfig.primaryColor }}
                  >
                    👑
                  </div>
                  <div className="w-2 h-2 bg-amber-400 rotate-45 -mt-1 shadow-md" />
                </div>
              )}

              {/* Tile Stepping Stone Button */}
              <button
                type="button"
                onClick={() => onTileClick(node.index)}
                disabled={isLocked}
                className={`relative group w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl border-2 flex items-center justify-center font-black text-sm md:text-base transition-all duration-300 shadow-xl ${
                  isCurrent
                    ? `${themeConfig.activeTileBg} ring-4 ring-amber-400/50 scale-110 shadow-amber-500/40 hover:scale-115 animate-pulse`
                    : isCompleted
                    ? `${themeConfig.completedTileBg} hover:scale-105 shadow-emerald-500/20`
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-500 cursor-not-allowed opacity-75'
                }`}
              >
                {/* Finish Chest Icon */}
                {isFinishTile ? (
                  <span className="text-xl md:text-2xl" title="Treasure Finish">
                    🎁
                  </span>
                ) : isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4 text-slate-600" />
                ) : (
                  <span>{node.label}</span>
                )}

                {/* Subtitle tooltip on hover */}
                <span className="absolute -bottom-6 px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                  {isFinishTile ? 'Finish!' : `${t('tile')} ${node.label}`}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Map Info Footer: "1 Correct Answer = 1 Step Forward" */}
      <div className="relative z-20 px-6 py-3 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-amber-300">
          <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
          <span>{t('oneStepForward')}</span>
        </div>

        <button
          type="button"
          onClick={() => onTileClick(currentTile)}
          className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-xs md:text-sm shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition hover:scale-105 active:scale-95"
        >
          <span>{currentTile === 0 ? t('startLevel') : t('resumeQuest')}</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
