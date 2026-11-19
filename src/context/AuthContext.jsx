import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

const DEMO_USER_KEY = 'civicfix_demo_user_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal display state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot_password'

  // Helper to extract or construct profile from user
  const extractProfile = useCallback((usr) => {
    if (!usr) return null;
    const meta = usr.user_metadata || {};
    return {
      id: usr.id,
      email: usr.email,
      fullName: meta.full_name || meta.name || usr.email?.split('@')[0] || 'Citizen',
      role: meta.role || (usr.email?.includes('admin') || usr.email?.includes('gov') ? 'admin' : 'citizen'),
      department: meta.department || (meta.role === 'admin' ? 'BBMP Municipal Administration' : ''),
      phone: meta.phone || '',
      ward: meta.ward || 'Central Bengaluru',
      avatarUrl: meta.avatar_url || meta.picture || '',
      isDemo: Boolean(meta.isDemo)
    };
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (mounted) {
            setSession(data.session);
            setUser(data.session?.user || null);
            setProfile(extractProfile(data.session?.user));
          }
        } catch (err) {
          console.warn('Supabase getSession error:', err);
        } finally {
          if (mounted) setLoading(false);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            if (!mounted) return;
            setSession(newSession);
            setUser(newSession?.user || null);
            setProfile(extractProfile(newSession?.user));
            setLoading(false);
          }
        );

        return () => {
          subscription?.unsubscribe();
        };
      } else {
        // Check for local demo user if unconfigured
        try {
          const savedDemoUser = localStorage.getItem(DEMO_USER_KEY);
          if (savedDemoUser && mounted) {
            const parsed = JSON.parse(savedDemoUser);
            setUser(parsed);
            setProfile(extractProfile(parsed));
          }
        } catch (e) {}
        if (mounted) setLoading(false);
      }
    }

    const cleanupPromise = initAuth();

    return () => {
      mounted = false;
      if (cleanupPromise && typeof cleanupPromise.then === 'function') {
        cleanupPromise.then((unsub) => {
          if (typeof unsub === 'function') unsub();
        });
      }
    };
  }, [extractProfile]);

  // Open Modal helpers
  const openLogin = useCallback(() => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  }, []);

  const openRegister = useCallback(() => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  }, []);

  const openForgotPassword = useCallback(() => {
    setAuthModalMode('forgot_password');
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Sign in with Email & Password
  const signInWithPassword = async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file, or use Quick Demo Sign In.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  // Sign up with Email, Password & User Metadata
  const signUp = async ({ email, password, fullName, role = 'citizen', department = '', phone = '', ward = '' }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file, or use Quick Demo Sign In.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          department: role === 'admin' ? (department || 'BBMP Municipal Administration') : '',
          phone,
          ward: ward || 'Central Bengaluru'
        }
      }
    });
    if (error) throw error;
    return data;
  };

  // Magic Link OTP login
  const signInWithOtp = async ({ email }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please configure your .env file.');
    }
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  };

  // Password reset email
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please configure your .env file.');
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#reset-password`
    });
    if (error) throw error;
    return data;
  };

  // Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Sign out error:', error);
    }
    // Clear demo storage
    try {
      localStorage.removeItem(DEMO_USER_KEY);
    } catch (e) {}

    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Quick Demo Sign In for immediate testing
  const loginAsDemo = (demoRole = 'citizen') => {
    const isOfficial = demoRole === 'admin';
    const demoUser = {
      id: isOfficial ? 'demo-official-bbmp-01' : 'demo-citizen-blr-42',
      email: isOfficial ? 'official.kavitha@bbmp.gov.in' : 'aarav.sharma@bengaluru.in',
      user_metadata: {
        full_name: isOfficial ? 'Kavitha R. (Chief Ward Officer)' : 'Aarav Sharma',
        role: isOfficial ? 'admin' : 'citizen',
        department: isOfficial ? 'BBMP East Zone Public Works' : '',
        phone: isOfficial ? '+91 98450 12345' : '+91 98765 43210',
        ward: isOfficial ? 'Ward 150 - Bellandur' : 'Ward 174 - HSR Layout',
        isDemo: true
      }
    };

    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    } catch (e) {}

    setUser(demoUser);
    setProfile(extractProfile(demoUser));
    closeAuthModal();
  };

  // Update profile
  const updateProfile = async (updates) => {
    if (isSupabaseConfigured && session) {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });
      if (error) throw error;
      setUser(data.user);
      setProfile(extractProfile(data.user));
      return data;
    } else if (user) {
      // Local update for demo user
      const updatedUser = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          ...updates
        }
      };
      try {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updatedUser));
      } catch (e) {}
      setUser(updatedUser);
      setProfile(extractProfile(updatedUser));
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isConfigured: isSupabaseConfigured,
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    openLogin,
    openRegister,
    openForgotPassword,
    closeAuthModal,
    signInWithPassword,
    signUp,
    signInWithOtp,
    signOut,
    resetPassword,
    loginAsDemo,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

