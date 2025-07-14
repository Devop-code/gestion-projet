"use client"
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'student' | 'supervisor';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role?: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setLoading(false);
        router.push(`/${data.user.role}`)
        return { error: null };
      } else {
        setLoading(false);
        return { error: data.error || 'Erreur de connexion' };
      }
    } catch (e) {
      setLoading(false);
      return { error: 'Erreur réseau',e };
    }

  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: UserRole = 'student') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, role }),
      });
      const data = await res.json();
      if (res.ok && data[0]) {
        setUser(data[0]);
        localStorage.setItem('auth_user', JSON.stringify(data[0]));
        setLoading(false);
        return { error: null };
      } else {
        setLoading(false);
        return { error: data.error || 'Erreur lors de l\'inscription' };
      }
    } catch (e) {
      setLoading(false);
      return { error: 'Erreur réseau',e };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}; 