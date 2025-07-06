
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateProjectDialog = ({ open, onOpenChange }: CreateProjectDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'group_project' | 'internship_report'>('group_project');
  const [supervisor, setSupervisor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation de la création du projet
    setTimeout(() => {
      console.log('Projet créé:', { title, description, type, supervisor });
      
      // Reset form
      setTitle('');
      setDescription('');
      setType('group_project');
      setSupervisor('');
      setLoading(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau projet</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau projet pour les étudiants
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du projet</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de projet</Label>
            <Select value={type} onValueChange={(value: 'group_project' | 'internship_report') => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="group_project">Projet de groupe</SelectItem>
                <SelectItem value="internship_report">Rapport de stage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisor">Encadreur</Label>
            <Select value={supervisor} onValueChange={setSupervisor}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un encadreur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dr-martin">Dr. Martin Dubois</SelectItem>
                <SelectItem value="prof-sarah">Prof. Sarah Leblanc</SelectItem>
                <SelectItem value="dr-pierre">Dr. Pierre Moreau</SelectItem>
              </SelectContent>
            </Select>
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
