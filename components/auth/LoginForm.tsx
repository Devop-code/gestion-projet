"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({
        title: "Erreur de connexion",
        description: error,
        variant: 'destructive',
      });
    } else {
      // Redirection selon le rôle
      if (user?.role === "admin") router.push("/admin");
      else if (user?.role === "supervisor") router.push("/supervisor");
      else if (user?.role === "student") router.push("/student");
      else router.push(`/${user?.role}`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre compte pour accéder à l application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
