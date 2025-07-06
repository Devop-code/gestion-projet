
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckSquare, Clock, User } from 'lucide-react';

interface TaskListDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskList: any;
  onCreateTask: () => void;
}

export const TaskListDetailsDialog = ({ open, onOpenChange, taskList, onCreateTask }: TaskListDetailsDialogProps) => {
  if (!taskList) return null;

  const mockTasks = [
    {
      id: '1',
      title: 'Implémenter l\'authentification',
      status: 'in_progress',
      assignedTo: 'Alice Martin',
      dueDate: '2024-07-10',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Rédiger la documentation API',
      status: 'pending',
      assignedTo: 'Bob Dupont',
      dueDate: '2024-07-12',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Tests unitaires',
      status: 'completed',
      assignedTo: 'Clara Rousseau',
      dueDate: '2024-07-05',
      priority: 'low'
    }
  ];

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {taskList.title}
            <Button size="sm" onClick={onCreateTask}>
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle tâche
            </Button>
          </DialogTitle>
          <DialogDescription>{taskList.description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Tâches ({mockTasks.length})</h4>
            <div className="flex space-x-2 text-sm">
              <span className="text-green-600">
                {mockTasks.filter(t => t.status === 'completed').length} terminées
              </span>
              <span className="text-blue-600">
                {mockTasks.filter(t => t.status === 'in_progress').length} en cours
              </span>
              <span className="text-gray-600">
                {mockTasks.filter(t => t.status === 'pending').length} à faire
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {mockTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">{task.title}</h5>
                  <Badge className={getStatusColor(task.status)}>
                    {getStatusLabel(task.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {task.assignedTo}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <span className={`text-xs ${
                    task.priority === 'high' ? 'text-red-600' : 
                    task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {task.priority === 'high' ? 'Haute' : 
                     task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
