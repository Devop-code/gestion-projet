
import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

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
                S'inscrire
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
