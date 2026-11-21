import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCivic } from '../context/CivicContext';
import {
  X,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building,
  Award,
  LogOut,
  Sparkles,
  Check,
  Edit2
} from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, profile, signOut, updateProfile, isConfigured } = useAuth();
  const { userKarma, setIsKarmaModalOpen, setRole, role, addToast } = useCivic();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.fullName || '');
  const [phoneInput, setPhoneInput] = useState(profile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: nameInput.trim(),
        phone: phoneInput.trim()
      });
      addToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      addToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    onClose();
    await signOut();
    addToast('Signed out of CivicFix.', 'info');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Civic Member Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* User Hero Badge */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {profile?.fullName || 'Citizen User'}
                </h4>
                {profile?.role === 'admin' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                    <ShieldCheck className="w-3 h-3" />
                    Official
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                    <User className="w-3 h-3" />
                    Citizen
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {profile?.email}
              </p>
              {profile?.isDemo && (
                <span className="inline-block text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  • Quick Demo Session
                </span>
              )}
            </div>
          </div>

          {/* Quick Karma Stats */}
          <div
            onClick={() => {
              onClose();
              setIsKarmaModalOpen(true);
            }}
            className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-xl flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 rounded-lg">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Civic Karma & Badges
                </span>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  {userKarma?.badges?.length || 2} active badges unlocked
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-amber-700 dark:text-amber-300">
                {userKarma?.points || 135}
              </span>
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 block -mt-1">
                pts
              </span>
            </div>
          </div>

          {/* Profile Details or Edit Form */}
          {!isEditing ? (
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Account ID</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                  {user.id}
                </span>
              </div>

              {profile?.department && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Department</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium text-right max-w-[220px]">
                    {profile.department}
                  </span>
                </div>
              )}

              {profile?.phone && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Contact Phone</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {profile.phone}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Auth Engine</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {isConfigured ? 'Supabase Cloud (Active)' : 'Supabase (Demo Mode)'}
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(profile?.fullName || '');
                    setPhoneInput(profile?.phone || '');
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Name / Phone</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Sign Out CTA */}
          <button
            onClick={handleSignOut}
            className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out from CivicFix</span>
          </button>
        </div>
      </div>
    </div>
  );
}

