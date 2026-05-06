'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Sending login request...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('AuthContext: Response status:', response.status);

      const data = await response.json();
      console.log('AuthContext: Response data:', data);

      if (!response.ok) {
        return { error: data.error || 'Login failed' };
      }

      console.log('AuthContext: Setting user state:', data.user);
      setUser(data.user);
      console.log('AuthContext: User state set successfully');
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'Network error' };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Registration failed' };
      }
      
      setUser(data.user);
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'Network error' };
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return { error: result.error || 'Update failed' };
      }
      
      setUser(result.user);
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: 'Network error' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
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
