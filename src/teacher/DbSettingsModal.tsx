import React, { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { Database, CheckCircle2, AlertTriangle, Key, ExternalLink, RefreshCw, Copy, Check } from 'lucide-react';
import { sound } from '../services/audio';

interface DbSettingsModalProps {
  onResetSeedData: () => void;
  onClose: () => void;
}

export const DbSettingsModal: React.FC<DbSettingsModalProps> = ({
  onResetSeedData,
  onClose,
}) => {
  const { t } = useLanguage();
  const configured = isSupabaseConfigured();
  const [copied, setCopied] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const handleCopySchemaNotice = () => {
    navigator.clipboard.writeText('supabase-schema.sql');
    setCopied(true);
    sound.playStep();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-game">{t('dbSettings')}</h2>
              <p className="text-xs text-slate-400">PostgreSQL Database & Supabase Cloud Connection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          {/* Connection Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              configured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            }`}
          >
            {configured ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm text-white">
                {configured ? 'Supabase Cloud Connected' : 'Running on Local Persistent Engine'}
              </h4>
              <p className="text-xs mt-1 leading-relaxed text-slate-300">
                {configured
                  ? 'Your application is connected to live Supabase PostgreSQL. Progress, questions, and students are synchronized in cloud tables.'
                  : 'Currently operating seamlessly in high-fidelity local persistent storage. All student progress, questions, and inventory persist across reloads.'}
              </p>
            </div>
          </div>

          {/* Environment Variables Info */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Required Environment Variables (.env)
            </span>

            <div className="space-y-2 font-mono text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">VITE_SUPABASE_URL</span>
                <span className="text-indigo-300 break-all">
                  {supabaseUrl || 'https://your-project-id.supabase.co'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">VITE_SUPABASE_ANON_KEY</span>
                <span className="text-indigo-300 break-all">
                  {supabaseKey ? `${supabaseKey.slice(0, 16)}...` : 'your-anon-public-key'}
                </span>
              </div>
            </div>
          </div>

          {/* Migration File Notice */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2">
            <h5 className="text-xs font-bold text-white flex items-center justify-between">
              <span>SQL Schema Migration</span>
              <button
                onClick={handleCopySchemaNotice}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>supabase-schema.sql</span>
              </button>
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              Run the included <code className="text-amber-300 font-mono">/supabase-schema.sql</code> file in your Supabase SQL Editor. It automatically sets up:
            </p>
            <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
              <li>18 Normalized Tables (profiles, classes, questions, progress, shop)</li>
              <li>Row Level Security (RLS) policies</li>
              <li>Atomic RPC function <code className="text-indigo-300 font-mono">award_step_and_coins</code></li>
            </ul>
          </div>

          {/* Reset / Re-seed Button */}
          <div className="pt-2 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Reset Default Demo Data</span>
              <span className="text-[11px] text-slate-400">Restores initial student profiles, worlds, and question sets</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset and restore demo student accounts, questions, and worlds?')) {
                  onResetSeedData();
                  sound.playCorrect();
                  onClose();
                }
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
