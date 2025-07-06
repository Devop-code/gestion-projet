
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Users, FileText } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description?: string;
  type: string;
  supervisor: string;
  members: number;
  createdAt: string;
  status?: string;
}

interface ProjectDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export const ProjectDetailsDialog = ({ open, onOpenChange, project }: ProjectDetailsDialogProps) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {project.title}
            <Badge className={getStatusColor(project.status)}>
              {project.status === 'completed' ? 'Terminé' : 
               project.status === 'in_progress' ? 'En cours' : 'En attente'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            <Badge variant="outline">
              {getTypeLabel(project.type)}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Encadreur</h4>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2" />
                {project.supervisor}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Membres</h4>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2" />
                {project.members} étudiants
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
                <p className="text-sm whitespace-pre-wrap">{project.description}</p>
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
                <div className="text-lg font-semibold text-blue-600">5</div>
                <div className="text-xs text-blue-600">Rapports</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-lg font-semibold text-green-600">{project.members}</div>
                <div className="text-xs text-green-600">Participants</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="flex items-center justify-center mb-1">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="text-lg font-semibold text-yellow-600">12</div>
                <div className="text-xs text-yellow-600">Séances</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">
            Modifier
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
