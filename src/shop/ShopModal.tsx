import React, { useState } from 'react';
import { ShopItem, ShopCategory, CharacterConfig } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Coins, Sparkles, Check, ShoppingBag, Crown, Shirt, Wand2, Footprints, ShieldAlert } from 'lucide-react';
import { sound } from '../services/audio';

interface ShopModalProps {
  coins: number;
  inventoryItemIds: string[];
  characterConfig: CharacterConfig;
  shopItems: ShopItem[];
  onBuyItem: (item: ShopItem) => boolean;
  onEquipItem: (item: ShopItem) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  coins,
  inventoryItemIds,
  characterConfig,
  shopItems,
  onBuyItem,
  onEquipItem,
  onClose,
}) => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ShopCategory | 'all'>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories: Array<{ id: ShopCategory | 'all'; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'hats', label: t('hats'), icon: <Crown className="w-4 h-4" /> },
    { id: 'clothing', label: t('clothing'), icon: <Shirt className="w-4 h-4" /> },
    { id: 'accessories', label: t('accessories'), icon: <Wand2 className="w-4 h-4" /> },
    { id: 'shoes', label: t('shoes'), icon: <Footprints className="w-4 h-4" /> },
  ];

  const filteredItems = shopItems.filter((item) =>
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  const handleBuy = (item: ShopItem) => {
    if (coins < item.price) {
      sound.playWrong();
      setErrorMsg(t('notEnoughCoins'));
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    const ok = onBuyItem(item);
    if (ok) {
      sound.playCoin();
      setErrorMsg(null);
    }
  };

  const handleEquip = (item: ShopItem) => {
    sound.playStep();
    onEquipItem(item);
  };

  const isEquipped = (item: ShopItem): boolean => {
    if (item.category === 'hats') return characterConfig.hatId === item.assetKey;
    if (item.category === 'clothing') return characterConfig.outfitId === item.assetKey;
    if (item.category === 'accessories') return characterConfig.accessoryId === item.assetKey;
    if (item.category === 'shoes') return characterConfig.shoesId === item.assetKey;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-2xl text-slate-950 shadow-lg shadow-amber-500/20">
              <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-game">{t('shop')}</h2>
              <p className="text-xs text-slate-400">Unlock custom cosmetics with your hard-earned math coins</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Coin Balance Pill */}
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-amber-400 font-bold text-sm shadow-inner">
              <Coins className="w-5 h-5 text-amber-400 animate-bounce" />
              <span>{coins}</span>
              <span className="text-xs text-amber-300 font-normal">{t('coins')}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Error Alert if insufficient funds */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs font-semibold flex items-center gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Categories Bar */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playStep();
                setActiveCategory(cat.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isOwned = inventoryItemIds.includes(item.id);
            const currentlyEquipped = isEquipped(item);

            return (
              <div
                key={item.id}
                className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-600 transition group hover:shadow-xl hover:shadow-indigo-500/5 relative"
              >
                {item.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    {item.badge}
                  </span>
                )}

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    {item.category === 'hats' && <Crown className="w-6 h-6 text-amber-400" />}
                    {item.category === 'clothing' && <Shirt className="w-6 h-6 text-indigo-400" />}
                    {item.category === 'accessories' && <Wand2 className="w-6 h-6 text-pink-400" />}
                    {item.category === 'shoes' && <Footprints className="w-6 h-6 text-emerald-400" />}
                  </div>

                  <h3 className="font-bold text-white text-sm mb-1">{item.name[language]}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {item.description[language]}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  {/* Price */}
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 text-sm">
                    <Coins className="w-4 h-4" />
                    <span>{item.price}</span>
                  </div>

                  {/* Action button */}
                  {isOwned ? (
                    currentlyEquipped ? (
                      <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {t('equipped')}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEquip(item)}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md"
                      >
                        {t('equip')}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={coins < item.price}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        coins >= item.price
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('buy')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
