
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Users, FileText, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Dialog as Modal, DialogContent as ModalContent, DialogHeader as ModalHeader, DialogTitle as ModalTitle } from '@/components/ui/dialog';
import type { Profile } from '@/types/database';

interface Project {
  id: string;
  title: string;
  description?: string;
  type: string;
  supervisor: string | { first_name: string; last_name: string; id?: string };
  members?: { student: { first_name: string; last_name: string } }[];
  createdAt: string;
  status?: string;
}

interface ProjectDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export const ProjectDetailsDialog = ({ open, onOpenChange, project }: ProjectDetailsDialogProps) => {
  const [reportsCount, setReportsCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editType, setEditType] = useState<'group_project' | 'internship_report'>('group_project');
  const [editSupervisor, setEditSupervisor] = useState('');
  const [supervisors, setSupervisors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState('');
  const [students, setStudents] = useState<Profile[]>([]);
  const [allStudents, setAllStudents] = useState<Profile[]>([]);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!project) return;
    setEditTitle(project.title);
    setEditDescription(project.description || '');
    setEditType(project.type as 'group_project' | 'internship_report');
    setEditSupervisor(
      typeof project.supervisor === 'object' && project.supervisor.id
        ? project.supervisor.id
        : ''
    );
    // Charger le nombre de membres
    fetch(`/api/projectmembers?project_id=${project.id}`)
      .then(res => res.json())
      .then((members) => setStudents(
        members
          .map((m: { student?: Profile }) => m.student)
          .filter((s: Profile | undefined): s is Profile => !!s)
      ));
    // Charger le nombre de rapports
    fetch(`/api/sessionreports?project_id=${project.id}`)
      .then(res => res.json())
      .then((reports) => setReportsCount(reports.length));
    // Charger le nombre de séances (on suppose que chaque rapport = une séance)
    fetch(`/api/sessionreports?project_id=${project.id}`)
      .then(res => res.json())
      .then((reports) => setSessionsCount(reports.length));
    // Charger les superviseurs
    fetch('/api/profiles')
      .then(res => res.json())
      .then((data: Profile[]) => setSupervisors(data.filter((s) => s.role === 'supervisor')));
    // Charger tous les étudiants (pour ajout)
    fetch('/api/profiles')
      .then(res => res.json())
      .then((data: Profile[]) => setAllStudents(data.filter((s) => s.role === 'student')));
  }, [project]);

  if (!project) return null;

  const getTypeLabel = (type: string) => {
    return type === 'group_project' ? 'Projet de groupe' : 'Rapport de stage';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Correction pour l'affichage du superviseur
  const supervisorName = typeof project.supervisor === 'object'
    ? `${project.supervisor.first_name} ${project.supervisor.last_name}`
    : project.supervisor;

  // Correction pour l'affichage des membres
  const membersList = Array.isArray(project.members)
    ? project.members.map(m => `${m.student.first_name} ${m.student.last_name}`).join(', ')
    : `${students.length} étudiants`;

  // Liste des IDs des membres actuels
  const memberIds = students.map((s) => s.id);
  // Étudiants non-membres
  const availableStudents = allStudents.filter((s) => !memberIds.includes(s.id));

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          title: editTitle,
          description: editDescription,
          type: editType,
          supervisor_id: editSupervisor || null,
        }),
      });
      if (!res.ok) throw new Error('Erreur lors de la modification');
      toast({
        title: 'Projet modifié',
        description: 'Le projet a été modifié avec succès.',
      });
      setEditMode(false);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le projet',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce projet ?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: project.id }),
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      toast({
        title: 'Projet supprimé',
        description: 'Le projet a été supprimé avec succès.',
      });
      setLoading(false);
      onOpenChange(false);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le projet',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setAdding(true);
    try {
      const res = await fetch('/api/projectmembers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id, student_id: selectedStudent }),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'ajout');
      toast({ title: 'Étudiant ajouté', description: 'L\'étudiant a été ajouté au projet.' });
      setAddMemberOpen(false);
      setSelectedStudent('');
      // Rafraîchir la liste des membres
      fetch(`/api/projectmembers?project_id=${project.id}`)
        .then(res => res.json())
        .then((members) => setStudents(
          members
            .map((m: { student?: Profile }) => m.student)
            .filter((s: Profile | undefined): s is Profile => !!s)
        ));
    } catch {
      toast({ title: 'Erreur', description: 'Impossible d\'ajouter l\'étudiant', variant: 'destructive' });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {editMode ? (
              <form onSubmit={handleEdit} className="flex flex-col w-full gap-2">
                <Input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="font-bold text-lg"
                  required
                />
                <div className="flex gap-2">
                  <Select value={editType} onValueChange={v => setEditType(v as 'group_project' | 'internship_report')}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group_project">Projet de groupe</SelectItem>
                      <SelectItem value="internship_report">Rapport de stage</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={editSupervisor} onValueChange={setEditSupervisor}>
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Sélectionner un encadreur" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisors.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  rows={3}
                  placeholder="Description du projet"
                />
                <div className="space-y-2">
                  <Label htmlFor="author">Auteur</Label>
                  <Select value={author} onValueChange={setAuthor} disabled={!project || students.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder={project ? (students.length === 0 ? "Aucun étudiant" : "Sélectionner un auteur") : "Sélectionner un projet d'abord"} />
                    </SelectTrigger>
                    <SelectContent>
                      {students.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500 text-sm">Aucun étudiant pour ce projet</div>
                      ) : (
                        students.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button type="submit" disabled={loading}>Enregistrer</Button>
                  <Button type="button" variant="outline" onClick={() => setEditMode(false)}>Annuler</Button>
                </div>
              </form>
            ) : (
              <>
                {project.title}
                <Badge className={getStatusColor(project.status)}>
                  {project.status === 'completed' ? 'Terminé' : 
                   project.status === 'in_progress' ? 'En cours' : 'En attente'}
                </Badge>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            <Badge variant="outline">
              {getTypeLabel(project.type)}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        {!editMode && (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-2">Encadreur</h4>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2" />
                    {supervisorName}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-2">Membres</h4>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    {membersList}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">Date de création</h4>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
              {project.description && (
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-2">Description</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm whitespace-pre-wrap">{project.description}</span>
                  </div>
                </div>
              )}
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">Statistiques</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-1">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-lg font-semibold text-blue-600">{reportsCount}</div>
                    <div className="text-xs text-blue-600">Rapports</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-lg font-semibold text-green-600">{students.length}</div>
                    <div className="text-xs text-green-600">Participants</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Calendar className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="text-lg font-semibold text-yellow-600">{sessionsCount}</div>
                    <div className="text-xs text-yellow-600">Séances</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setEditMode(true)}>
                <Edit className="h-4 w-4 mr-1" /> Modifier
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                <Trash2 className="h-4 w-4 mr-1" /> Supprimer
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-2">Membres du projet</h4>
              <ul className="mb-2">
                {students.map((s) => (
                  <li key={s.id}>{s.first_name} {s.last_name}</li>
                ))}
              </ul>
              <Button size="sm" variant="outline" onClick={() => setAddMemberOpen(true)}>
                Ajouter un étudiant
              </Button>
            </div>
            <Modal open={addMemberOpen} onOpenChange={setAddMemberOpen}>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Ajouter un étudiant au projet</ModalTitle>
                </ModalHeader>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div>
                    <Label htmlFor="student">Étudiant</Label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent} required disabled={availableStudents.length === 0}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un étudiant" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStudents.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {availableStudents.length === 0 && (
                      <div className="text-sm text-gray-500 mt-2">Aucun étudiant disponible à ajouter.</div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setAddMemberOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={adding || !selectedStudent || availableStudents.length === 0}>
                      {adding ? 'Ajout...' : 'Ajouter'}
                    </Button>
                  </div>
                </form>
              </ModalContent>
            </Modal>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
