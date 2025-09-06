import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'ADMIN' | 'AGENT' | 'USER';

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  address?: string;
  geo_lat?: number;
  geo_lng?: number;
  about?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User | null, session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,

      setAuth: (user, session) => {
        set({ 
          user, 
          session, 
          isAuthenticated: !!session?.user,
          isLoading: false 
        });
        
        // Fetch profile when user is authenticated
        if (session?.user) {
          get().fetchProfile();
        } else {
          set({ profile: null });
        }
      },

      setProfile: (profile) => set({ profile }),

      setLoading: (isLoading) => set({ isLoading }),

      signIn: async (email, password) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!error && data.session) {
          get().setAuth(data.user, data.session);
        } else {
          set({ isLoading: false });
        }
        
        return { error };
      },

      signUp: async (email, password, fullName) => {
        set({ isLoading: true });
        const redirectUrl = `${window.location.origin}/`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            },
          },
        });
        
        if (!error && data.session) {
          get().setAuth(data.user, data.session);
        } else {
          set({ isLoading: false });
        }
        
        return { error };
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({ 
          user: null, 
          session: null, 
          profile: null, 
          isAuthenticated: false 
        });
      },

      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          set({ profile: { ...data, role: data.role as UserRole } });
        }
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return { error: new Error('Không có người dùng đăng nhập') };

        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single();

        if (!error && data) {
          set({ profile: { ...data, role: data.role as UserRole } });
        }

        return { error };
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        session: state.session,
        profile: state.profile,
      }),
    }
  )
);