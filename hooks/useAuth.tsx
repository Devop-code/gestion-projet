
import { useState } from 'react';

// Types pour les rôles
type UserRole = 'admin' | 'student' | 'supervisor';

// Données fictives pour l'authentification
const mockUser = {
  id: '1',
  email: 'admin@example.com',
  created_at: '2024-01-01T00:00:00Z'
};

const mockProfile = {
  id: '1',
  email: 'admin@example.com',
  first_name: 'Admin',
  last_name: 'User',
  role: 'admin' as UserRole,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const useAuth = () => {
  const [user] = useState(mockUser);
  const [profile] = useState(mockProfile);
  const [loading] = useState(false);

  const signIn = async (email: string, password: string) => {
    // Simulation d'authentification
    console.log('Sign in attempt:', email, password);
    return { error: null };
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: UserRole = 'student') => {
    // Simulation d'inscription
    console.log('Sign up attempt:', email, firstName, lastName, role);
    return { error: null };
  };

  const signOut = async () => {
    // Simulation de déconnexion
    console.log('Sign out');
    return { error: null };
  };
                          
  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
