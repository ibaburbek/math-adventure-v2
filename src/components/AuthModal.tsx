import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { UserRole } from '../types';
import { sound } from '../services/audio';
import {
  GraduationCap,
  Sparkles,
  KeyRound,
  User,
  ShieldAlert,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface AuthModalProps {
  onLoginTeacher: (username: string, pin: string) => boolean;
  onLoginStudent: (username: string, pin: string) => boolean;
  onRegisterTeacher: (username: string, pin: string, fullName: string) => boolean;
  onClose?: () => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onLoginTeacher,
  onLoginStudent,
  onRegisterTeacher,
  onClose,
  defaultRole = 'student',
}) => {
  const { t } = useLanguage();
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const [username, setUsername] = useState<string>('leo');
  const [pin, setPin] = useState<string>('1234');
  const [fullName, setFullName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleChange = (newRole: UserRole) => {
    sound.playStep();
    setRole(newRole);
    setIsRegistering(false);
    setErrorMsg(null);
    if (newRole === 'student') {
      setUsername('leo');
      setPin('1234');
    } else {
      setUsername('teacher');
      setPin('1234');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !pin.trim()) {
      setErrorMsg('Please enter both username and PIN.');
      sound.playWrong();
      return;
    }

    if (role === 'teacher') {
      if (isRegistering) {
        if (!fullName.trim()) {
          setErrorMsg('Please enter full name.');
          sound.playWrong();
          return;
        }
        const ok = onRegisterTeacher(username.trim(), pin.trim(), fullName.trim());
        if (!ok) {
          setErrorMsg('Username already exists. Please pick another.');
          sound.playWrong();
          return;
        }
      } else {
        const ok = onLoginTeacher(username.trim(), pin.trim());
        if (!ok) {
          setErrorMsg('Invalid Teacher username or PIN.');
          sound.playWrong();
          return;
        }
      }
    } else {
      const ok = onLoginStudent(username.trim(), pin.trim());
      if (!ok) {
        setErrorMsg('Student username or PIN not found.');
        sound.playWrong();
        return;
      }
    }

    sound.playCorrect();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Role Segmented Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('student')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('teacher')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'teacher'
                ? 'bg-indigo-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t('teacher')}</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-black text-white font-game">
            {role === 'student'
              ? 'Student Adventurer Login'
              : isRegistering
              ? t('register')
              : 'Teacher Command Login'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {role === 'student'
              ? 'Log in with your hero username and 4-digit PIN'
              : 'Secure teacher management portal'}
          </p>
        </div>

        {/* Error alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-200 text-xs font-semibold flex items-center gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'teacher' && isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teacher Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ms. Aigul / Mr. Alex"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('username')}</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === 'student' ? 'e.g. leo' : 'e.g. teacher'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('pin')}</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={6}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder={t('pinPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono tracking-widest focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition hover:scale-102 mt-2"
          >
            <span>{isRegistering ? 'Complete Registration' : t('login')}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        {/* Demo credentials hint & toggle */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center space-y-2">
          {role === 'teacher' && (
            <button
              type="button"
              onClick={() => {
                sound.playStep();
                setIsRegistering(!isRegistering);
                setErrorMsg(null);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              {isRegistering ? 'Already have an account? Log In' : 'New Teacher? Register here'}
            </button>
          )}

          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            <span className="font-bold text-amber-400 block mb-0.5">Quick Demo Accounts:</span>
            {role === 'student' ? (
              <span>Username: <code className="text-white">leo</code> • PIN: <code className="text-white">1234</code></span>
            ) : (
              <span>Username: <code className="text-white">teacher</code> • PIN: <code className="text-white">1234</code></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
