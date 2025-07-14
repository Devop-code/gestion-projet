"use client"
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateReportDialog = ({ open, onOpenChange }: CreateReportDialogProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [project, setProject] = useState('');
  const [student, setStudent] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    // Charger les projets supervisés
    fetch(`/api/projects?supervisor_id=${user.id}`)
      .then(res => res.json())
      .then(setProjects);
  }, [user]);

  useEffect(() => {
    if (!project) return;
    // Charger les membres du projet sélectionné
    fetch(`/api/projectmembers?project_id=${project}`)
      .then(res => res.json())
      .then((members) => setStudents(members.map((m: any) => m.student)));
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/sessionreports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          type,
          project_id: project,
          author_id: student,
          session_date: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        let msg = 'Erreur lors de la création';
        try {
          const data = await res.json();
          if (data && data.error) msg = data.error;
        } catch {}
        throw new Error(msg);
      }
      toast({
        title: 'Rapport créé',
        description: 'Le rapport a été créé avec succès.',
      });
      setTitle('');
      setContent('');
      setProject('');
      setStudent('');
      setType('');
      setLoading(false);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de créer le rapport',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau rapport</DialogTitle>
          <DialogDescription>
            Créer un rapport d'évaluation ou de suivi pour un étudiant
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du rapport</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Évaluation hebdomadaire"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de rapport</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="evaluation">Évaluation</SelectItem>
                <SelectItem value="progress">Suivi de progrès</SelectItem>
                <SelectItem value="feedback">Retour d'expérience</SelectItem>
                <SelectItem value="milestone">Jalon de projet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Projet concerné</Label>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un projet" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="student">Étudiant concerné</Label>
            <Select value={student} onValueChange={setStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu du rapport</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Décrivez les observations, évaluations et recommandations..."
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer le rapport'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
