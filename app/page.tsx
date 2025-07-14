"use client"
import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Shield } from 'lucide-react';

export const Auth = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Gestion Projets Universitaires
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {showRegister ? (
            <>
              Déjà un compte ?{' '}
              <button
                onClick={() => setShowRegister(false)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Se connecter
              </button>
            </>
          ) : (
            <>
              Pas encore de compte ?{' '}
              <button
                onClick={() => setShowRegister(true)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                S inscrire
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {showRegister ? (
          <RegisterForm onBackToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Gestion Projets Universitaires
        </h1>
        <p className="text-lg text-gray-600">
          Choisissez votre interface selon votre rôle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <CardTitle>Administrateur</CardTitle>
            <CardDescription>
              Gestion complète des projets et utilisateurs
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <UserCheck className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <CardTitle>Encadreur</CardTitle>
            <CardDescription>
              Supervision des projets et validation des rapports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth">
              <Button className="w-full">
                Accéder au tableau de bord Encadreur
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <CardTitle>Étudiant</CardTitle>
            <CardDescription>
              Gestion de vos projets et soumission de rapports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth">
              <Button className="w-full">
                Accéder au tableau de bord Étudiant
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
