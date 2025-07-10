"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onBackToLogin: () => void;
}

export const RegisterForm = ({ onBackToLogin }: RegisterFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'supervisor'>('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Erreur d'inscription",
          description: data.error || 'Erreur inconnue',
          variant: 'destructive',
        });
      } else {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès.",
        });
      }
    } catch (error: unknown) {
      let message = 'Erreur inconnue';
      if (error && typeof error === 'object' && 'message' in error) {
        message = (error as { message: string }).message;
      }
      toast({
        title: "Erreur d'inscription",
        description: message,
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>
          Inscrivez-vous pour accéder à l application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={role} onValueChange={(value: 'student' | 'supervisor') => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Étudiant</SelectItem>
                <SelectItem value="supervisor">Encadreur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onBackToLogin}>
            Retour à la connexion
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
