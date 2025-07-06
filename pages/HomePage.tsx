
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Shield } from 'lucide-react';

export const HomePage = () => {
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
          <CardContent>
            <Link to="/admin">
              <Button className="w-full">
                Accéder au tableau de bord Admin
              </Button>
            </Link>
          </CardContent>
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
            <Link to="/supervisor">
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
            <Link to="/student">
              <Button className="w-full">
                Accéder au tableau de bord Étudiant
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
