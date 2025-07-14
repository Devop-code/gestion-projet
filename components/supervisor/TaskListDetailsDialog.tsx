
import { useEffect, useState } from 'react';
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

interface Task {
  id: string;
  title: string;
  status: string;
  assigned_to?: { first_name: string; last_name: string } | string;
  dueDate?: string;
  priority?: string;
}

export const TaskListDetailsDialog = ({ open, onOpenChange, taskList, onCreateTask }: TaskListDetailsDialogProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !taskList) return;
    setLoading(true);
    fetch(`/api/tasks?task_list_id=${taskList.id}`)
      .then(res => res.json())
      .then(setTasks)
      .finally(() => setLoading(false));
  }, [open, taskList]);

  if (!taskList) return null;

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
            <h4 className="font-medium">Tâches ({tasks.length})</h4>
            <div className="flex space-x-2 text-sm">
              <span className="text-green-600">
                {tasks.filter(t => t.status === 'completed').length} terminées
              </span>
              <span className="text-blue-600">
                {tasks.filter(t => t.status === 'in_progress').length} en cours
              </span>
              <span className="text-gray-600">
                {tasks.filter(t => t.status === 'pending').length} à faire
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-gray-500">Chargement...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center text-gray-500">Aucune tâche pour cette liste.</div>
            ) : (
              tasks.map((task) => (
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
                        {typeof task.assigned_to === 'string'
                          ? task.assigned_to
                          : task.assigned_to
                          ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}`
                          : '-'}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : '-'}
                      </span>
                    </div>
                    <span className={`text-xs ${
                      task.priority === 'high'
                        ? 'text-red-600'
                        : task.priority === 'medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                      {task.priority === 'high'
                        ? 'Haute'
                        : task.priority === 'medium'
                        ? 'Moyenne'
                        : 'Basse'}
                    </span>
                  </div>
                </div>
              ))
            )}
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
