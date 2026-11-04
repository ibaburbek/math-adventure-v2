import React, { useState } from 'react';
import { Character3DViewer } from './Character3DViewer';
import { CHARACTER_PRESETS } from './characterPresets';
import { CharacterConfig, ShopItem } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Sparkles, Check, Palette, Shirt, Crown, Wand2, Footprints, RotateCcw } from 'lucide-react';
import { sound } from '../services/audio';

interface CharacterCustomizerProps {
  currentConfig: CharacterConfig;
  unlockedItems: ShopItem[];
  onSave: (newConfig: CharacterConfig) => void;
  onClose: () => void;
}

const COLOR_PALETTE = [
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#475569', // Slate
];

const SKIN_TONES = [
  '#fcd34d', // Golden chibi
  '#ffedd5', // Pale peach
  '#fed7aa', // Light tan
  '#f97316', // Fox orange
  '#c084fc', // Dragon purple
  '#94a3b8', // Cyber metal
  '#78350f', // Deep brown
];

export const CharacterCustomizer: React.FC<CharacterCustomizerProps> = ({
  currentConfig,
  unlockedItems,
  onSave,
  onClose,
}) => {
  const { t, language } = useLanguage();
  const [config, setConfig] = useState<CharacterConfig>({ ...currentConfig });
  const [activeTab, setActiveTab] = useState<'hero' | 'colors' | 'hats' | 'outfit' | 'accessories' | 'shoes'>('hero');

  const selectedHeroPreset = CHARACTER_PRESETS.find((p) => p.id === config.characterId) || CHARACTER_PRESETS[1];

  const handleSelectHero = (heroId: string) => {
    const preset = CHARACTER_PRESETS.find((p) => p.id === heroId);
    if (!preset) return;
    sound.playStep();
    setConfig((prev) => ({
      ...prev,
      characterId: preset.id,
      primaryColor: preset.baseColor,
      secondaryColor: preset.secondaryColor,
      skinTone: preset.skinTone,
    }));
  };

  const handlePoseChange = (pose: CharacterConfig['animationState']) => {
    sound.playStep();
    setConfig((prev) => ({ ...prev, animationState: pose }));
  };

  const handleSave = () => {
    sound.playCorrect();
    onSave(config);
    onClose();
  };

  // Filter unlocked items by category
  const unlockedHats = unlockedItems.filter((i) => i.category === 'hats');
  const unlockedOutfits = unlockedItems.filter((i) => i.category === 'clothing');
  const unlockedAccessories = unlockedItems.filter((i) => i.category === 'accessories');
  const unlockedShoes = unlockedItems.filter((i) => i.category === 'shoes');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-game">{t('heroCustomizer')}</h2>
              <p className="text-xs text-slate-400">{t('rotateHeroTip')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: 3D Viewport & Pose Controls */}
          <div className="md:col-span-5 bg-gradient-to-b from-slate-950/90 to-slate-900 flex flex-col items-center justify-between p-4 border-b md:border-b-0 md:border-r border-slate-800">
            <div className="w-full text-center">
              <span className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300">
                {selectedHeroPreset.name[language]} — {selectedHeroPreset.title[language]}
              </span>
            </div>

            {/* 3D Character Canvas */}
            <div className="w-full h-72 md:h-80 relative flex items-center justify-center">
              <Character3DViewer config={config} autoRotate={false} interactive={true} />
            </div>

            {/* Animation Pose Selector */}
            <div className="w-full bg-slate-800/80 p-2 rounded-2xl border border-slate-700/60 flex items-center justify-between gap-1">
              {(['idle', 'walking', 'celebration', 'victory'] as const).map((pose) => (
                <button
                  key={pose}
                  onClick={() => handlePoseChange(pose)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                    config.animationState === pose
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {t(pose)}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Customization Tabs & Options */}
          <div className="md:col-span-7 flex flex-col p-5 overflow-y-auto bg-slate-900/60">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1.5 pb-4 border-b border-slate-800">
              <button
                onClick={() => setActiveTab('hero')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'hero' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t('characters')}
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'colors' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                {t('primaryColor')}
              </button>
              <button
                onClick={() => setActiveTab('hats')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'hats' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                {t('hats')}
              </button>
              <button
                onClick={() => setActiveTab('outfit')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'outfit' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                {t('clothing')}
              </button>
              <button
                onClick={() => setActiveTab('accessories')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'accessories' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                {t('accessories')}
              </button>
              <button
                onClick={() => setActiveTab('shoes')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'shoes' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                {t('shoes')}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-4 flex-1">
              {/* Heroes Selection Tab */}
              {activeTab === 'hero' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CHARACTER_PRESETS.map((preset) => {
                    const isSelected = config.characterId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectHero(preset.id)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-md ring-2 ring-indigo-500/50'
                            : 'bg-slate-800/60 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="w-5 h-5 rounded-full shadow-inner border border-white/20"
                            style={{ backgroundColor: preset.baseColor }}
                          />
                          {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                        </div>
                        <span className="font-bold text-sm text-white">{preset.name[language]}</span>
                        <span className="text-[11px] text-slate-400">{preset.title[language]}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Colors Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{t('primaryColor')}</label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          onClick={() => setConfig((p) => ({ ...p, primaryColor: color }))}
                          className={`w-9 h-9 rounded-xl border-2 transition-transform ${
                            config.primaryColor === color ? 'scale-110 border-white shadow-lg' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{t('secondaryColor')}</label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          onClick={() => setConfig((p) => ({ ...p, secondaryColor: color }))}
                          className={`w-9 h-9 rounded-xl border-2 transition-transform ${
                            config.secondaryColor === color ? 'scale-110 border-white shadow-lg' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{t('skinTone')}</label>
                    <div className="flex flex-wrap gap-2">
                      {SKIN_TONES.map((color) => (
                        <button
                          key={color}
                          onClick={() => setConfig((p) => ({ ...p, skinTone: color }))}
                          className={`w-9 h-9 rounded-xl border-2 transition-transform ${
                            config.skinTone === color ? 'scale-110 border-white shadow-lg' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Hats Tab */}
              {activeTab === 'hats' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setConfig((p) => ({ ...p, hatId: 'none' }))}
                    className={`p-3 rounded-2xl border text-center transition ${
                      config.hatId === 'none' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800/60 border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-300">None</span>
                  </button>
                  {['wizard_hat', 'crown', 'fedora', 'helm', 'bunny_ears'].map((hatId) => {
                    const isEquipped = config.hatId === hatId;
                    return (
                      <button
                        key={hatId}
                        onClick={() => {
                          sound.playStep();
                          setConfig((p) => ({ ...p, hatId }));
                        }}
                        className={`p-3 rounded-2xl border text-left transition ${
                          isEquipped ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Crown className="w-4 h-4 text-amber-400" />
                          {isEquipped && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <span className="text-xs font-bold text-white capitalize">{hatId.replace('_', ' ')}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Outfit Tab */}
              {activeTab === 'outfit' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {['armor', 'robe', 'cyber', 'tunic'].map((outfitId) => {
                    const isEquipped = config.outfitId === outfitId;
                    return (
                      <button
                        key={outfitId}
                        onClick={() => {
                          sound.playStep();
                          setConfig((p) => ({ ...p, outfitId }));
                        }}
                        className={`p-3 rounded-2xl border text-left transition ${
                          isEquipped ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Shirt className="w-4 h-4 text-indigo-400" />
                          {isEquipped && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <span className="text-xs font-bold text-white capitalize">{outfitId}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Accessories Tab */}
              {activeTab === 'accessories' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setConfig((p) => ({ ...p, accessoryId: 'none' }))}
                    className={`p-3 rounded-2xl border text-center transition ${
                      config.accessoryId === 'none' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800/60 border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-300">None</span>
                  </button>
                  {['staff', 'shield', 'wings'].map((accId) => {
                    const isEquipped = config.accessoryId === accId;
                    return (
                      <button
                        key={accId}
                        onClick={() => {
                          sound.playStep();
                          setConfig((p) => ({ ...p, accessoryId: accId }));
                        }}
                        className={`p-3 rounded-2xl border text-left transition ${
                          isEquipped ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Wand2 className="w-4 h-4 text-pink-400" />
                          {isEquipped && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <span className="text-xs font-bold text-white capitalize">{accId}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Shoes Tab */}
              {activeTab === 'shoes' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {['boots', 'winged_boots', 'sabaton'].map((shoeId) => {
                    const isEquipped = config.shoesId === shoeId;
                    return (
                      <button
                        key={shoeId}
                        onClick={() => {
                          sound.playStep();
                          setConfig((p) => ({ ...p, shoesId: shoeId }));
                        }}
                        className={`p-3 rounded-2xl border text-left transition ${
                          isEquipped ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Footprints className="w-4 h-4 text-emerald-400" />
                          {isEquipped && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <span className="text-xs font-bold text-white capitalize">{shoeId.replace('_', ' ')}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-sm font-semibold text-slate-300 transition"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition hover:scale-102"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
