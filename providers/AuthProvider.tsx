import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from 'utils/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Profile } from "providers/types"

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
  profile: Profile | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchAuthenticatedProfile = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, description, follower_number, following_number, save_number, like_number, share_number')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', session?.user.id],
    queryFn: () => fetchAuthenticatedProfile(session?.user.id as string),
    enabled: !!session?.user.id,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        queryClient.setQueryData(['profile', session?.user.id], null);
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ session, isLoading, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}