
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  project: string;
  status: string;
  dueDate: string;
  priority: string;
  description?: string;
  assignedTo?: string;
}

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export const TaskDetailsDialog = ({ open, onOpenChange, task }: TaskDetailsDialogProps) => {
  if (!task) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      default: return 'À faire';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      default: return 'Basse';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {task.title}
            <Badge className={getStatusColor(task.status)}>
              {getStatusLabel(task.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription>{task.project}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Échéance</h4>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(task.dueDate).toLocaleDateString('fr-FR')}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Priorité</h4>
              <div className="flex items-center text-sm">
                <AlertCircle className={`h-4 w-4 mr-2 ${getPriorityColor(task.priority)}`} />
                <span className={getPriorityColor(task.priority)}>
                  {getPriorityLabel(task.priority)}
                </span>
              </div>
            </div>
          </div>

          {task.assignedTo && (
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Assigné à</h4>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2" />
                {task.assignedTo}
              </div>
            </div>
          )}
          
          {task.description && (
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Description</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{task.description}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          {task.status !== 'completed' && (
            <Button variant="outline">
              Marquer comme terminé
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
