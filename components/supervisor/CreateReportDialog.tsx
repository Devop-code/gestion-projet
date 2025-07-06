
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateReportDialog = ({ open, onOpenChange }: CreateReportDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [project, setProject] = useState('');
  const [student, setStudent] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation de la création du rapport
    setTimeout(() => {
      console.log('Rapport créé:', { title, content, project, student, type });
      
      // Reset form
      setTitle('');
      setContent('');
      setProject('');
      setStudent('');
      setType('');
      setLoading(false);
      onOpenChange(false);
    }, 1000);
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
                <SelectItem value="ecommerce">Application Web de Gestion Scolaire</SelectItem>
                <SelectItem value="ai">Système de Recommandation IA</SelectItem>
                <SelectItem value="mobile">Rapport de Stage - Développement Mobile</SelectItem>
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
                <SelectItem value="alice">Alice Martin</SelectItem>
                <SelectItem value="bob">Bob Dupont</SelectItem>
                <SelectItem value="clara">Clara Rousseau</SelectItem>
                <SelectItem value="david">David Leclerc</SelectItem>
                <SelectItem value="emma">Emma Bernard</SelectItem>
                <SelectItem value="francois">François Petit</SelectItem>
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
