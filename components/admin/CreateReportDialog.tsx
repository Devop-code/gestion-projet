
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
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation de la création du rapport
    setTimeout(() => {
      console.log('Rapport créé:', { title, content, project, author });
      
      // Reset form
      setTitle('');
      setContent('');
      setProject('');
      setAuthor('');
      setLoading(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau rapport</DialogTitle>
          <DialogDescription>
            Ajoutez un rapport de séance ou de projet
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du rapport</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Projet associé</Label>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un projet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ecommerce">Application E-commerce</SelectItem>
                <SelectItem value="rh">Système de Gestion RH</SelectItem>
                <SelectItem value="fitness">Application Mobile Fitness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Auteur</Label>
            <Select value={author} onValueChange={setAuthor}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un auteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student1">Marie Dupont</SelectItem>
                <SelectItem value="student2">Jean Martin</SelectItem>
                <SelectItem value="student3">Sophie Leblanc</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu du rapport</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
