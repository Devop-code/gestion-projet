
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, UserCheck, Shield, LogIn } from 'lucide-react';

export const Header = () => {
  const location = useLocation();

  const getRoleFromPath = () => {
    if (location.pathname === '/admin') return 'Administrateur';
    if (location.pathname === '/supervisor') return 'Encadreur';
    if (location.pathname === '/student') return 'Étudiant';
    if (location.pathname === '/auth') return 'Authentification';
    return '';
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-gray-900">
                Gestion Projets Universitaires
              </h1>
            </Link>
            {getRoleFromPath() && (
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                {getRoleFromPath()}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
            <Link to="/supervisor">
              <Button variant="outline" size="sm">
                <UserCheck className="h-4 w-4 mr-2" />
                Encadreur
              </Button>
            </Link>
            <Link to="/student">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Étudiant
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
