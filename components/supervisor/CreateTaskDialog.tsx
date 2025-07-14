
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { Profile } from '@/types/database';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskListId: string;
}

export const CreateTaskDialog = ({ open, onOpenChange, taskListId }: CreateTaskDialogProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Profile[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    if (!taskListId) return;
    setStudentsLoading(true);
    // 1. Récupérer la taskList pour obtenir le project_id
    fetch(`/api/tasklists/${taskListId}`)
      .then(res => res.json())
      .then((taskList) => {
        const projectId = taskList.project_id || taskList.project?.id;
        if (!projectId) {
          setStudents([]);
          setStudentsLoading(false);
          return;
        }
        // 2. Récupérer les membres du projet
        fetch(`/api/projectmembers?project_id=${projectId}`)
          .then(res => res.json())
          .then((members) => {
            setStudents(
              members
                .map((m: { student?: Profile }) => m.student)
                .filter((s: Profile | undefined): s is Profile => !!s)
            );
            setStudentsLoading(false);
          });
      });
  }, [taskListId, open]);

  // Réinitialiser assignedTo si la valeur sélectionnée n'est plus dans la liste
  useEffect(() => {
    if (assignedTo && !students.find(s => s.id === assignedTo)) {
      setAssignedTo('');
    }
  }, [students]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          priority,
          status: 'pending',
          task_list_id: taskListId,
          created_by: user?.id || '',
          assigned_to: assignedTo || null,
        }),
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      toast({
        title: 'Tâche créée',
        description: 'La tâche a été créée avec succès.',
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssignedTo('');
      setLoading(false);
      onOpenChange(false);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la tâche',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une tâche</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle tâche à la liste
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
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
            <Label htmlFor="priority">Priorité</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Basse</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigné à</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo} disabled={students.length === 0 || studentsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={studentsLoading ? 'Chargement...' : 'Sélectionner un étudiant'} />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {students.length === 0 && !studentsLoading && (
              <div className="text-sm text-gray-500 mt-2">Aucun étudiant disponible pour ce projet.</div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || students.length === 0 || studentsLoading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
