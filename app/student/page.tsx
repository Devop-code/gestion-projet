"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CheckSquare, StickyNote, Calendar, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CreateNoteDialog } from '../../components/student/CreateNoteDialog';
import { NoteDetailsDialog } from '../../components/student/NoteDetailsDialog';
import { TaskDetailsDialog } from '../../components/student/TaskDetailsDialog';
import { CreateReportDialog } from '../../components/student/CreateReportDialog';
import { ReportDetailsDialog } from '../../components/student/ReportDetailsDialog';
import { useAuth } from '@/hooks/useAuth';

interface Project {
  id: string;
  title: string;
  type: string;
  supervisor?: { first_name: string; last_name: string } | null;
}

interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  priority: string;
  taskList?: { project?: { title: string } };
  project?: string; // pour compatibilité avec les dialogs
}

interface Note {
  id: string;
  title: string;
  content: string;
  created_at?: string;
  createdAt: string;
  project?: { title: string } | string;
}

interface Report {
  id: string;
  title: string;
  content: string;
  session_date?: string;
  sessionDate: string;
  createdAt: string;
  project?: { title: string } | string;
}

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [noteDetailsOpen, setNoteDetailsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createReportOpen, setCreateReportOpen] = useState(false);
  const [reportDetailsOpen, setReportDetailsOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    // Récupérer les projets où l'utilisateur est membre
    fetch(`/api/projectmembers?student_id=${user.id}`)
      .then(res => res.json())
      .then(async (members) => {
        const projectIds = members.map((m: { project_id: string }) => m.project_id);
        // Charger les projets
        const projectsRes = await fetch(`/api/projects`);
        const allProjects = await projectsRes.json();
        const filteredProjects = allProjects.filter((p: Project) => projectIds.includes(p.id));
        setProjects(filteredProjects);
      });
    // Récupérer les tâches assignées à l'utilisateur
    fetch(`/api/tasks?assigned_to=${user.id}`)
      .then(res => res.json())
      .then(setTasks);
    // Récupérer les notes créées par l'utilisateur
    fetch(`/api/notes?author_id=${user.id}`)
      .then(res => res.json())
      .then(setNotes);
    // Récupérer les rapports créés par l'utilisateur
    fetch(`/api/sessionreports?author_id=${user.id}`)
      .then(res => res.json())
      .then(setReports)
      .finally(() => setLoading(false));
  }, [user]);

  const handleCreateNote = (projectId: string) => {
    setSelectedProject(projectId);
    setCreateNoteOpen(true);
  };

  const handleCreateReport = (projectId: string) => {
    setSelectedProject(projectId);
    setCreateReportOpen(true);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setNoteDetailsOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailsOpen(true);
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setReportDetailsOpen(true);
  };

  const getTypeLabel = (type: string) => {
    return type === 'group_project' ? 'Projet de groupe' : 'Rapport de stage';
  };

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

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tableau de bord Étudiant</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Projets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              Projets actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status !== 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              En cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes</CardTitle>
            <StickyNote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">
              Créées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Échéances</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}</div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes Projets</CardTitle>
            <CardDescription>
              Projets auxquels vous participez
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  <Badge variant="outline">
                    {getTypeLabel(project.type)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Encadreur: {project.supervisor ? (project.supervisor.first_name + ' ' + project.supervisor.last_name) : 'Non assigné'}
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    Progrès: <span className="font-medium">-</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    {/* À remplacer par la prochaine échéance réelle si dispo */}
                    -
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateNote(project.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Note
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateReport(project.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Rapport
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes Tâches</CardTitle>
            <CardDescription>
              Tâches assignées dans vos projets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{task.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {task.taskList && task.taskList.project ? (typeof task.taskList.project === 'string' ? task.taskList.project : task.taskList.project.title) : '-'}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">Échéance:</span>
                    <span className="text-xs font-medium">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : '-'}
                    </span>
                  </div>
                  <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes Notes Récentes</CardTitle>
            <CardDescription>
              Dernières notes que vous avez créées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {notes.map((note) => (
                <div 
                  key={note.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleNoteClick(note)}
                >
                  <h3 className="font-semibold mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {note.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{typeof note.project === 'string' ? note.project : note.project ? note.project.title : '-'}</span>
                    <span>{note.created_at ? new Date(note.created_at).toLocaleDateString('fr-FR') : '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes Rapports</CardTitle>
            <CardDescription>
              Rapports de séances créés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleReportClick(report)}
                >
                  <h3 className="font-semibold mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {report.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{typeof report.project === 'string' ? report.project : report.project ? report.project.title : '-'}</span>
                    <span>Séance: {report.session_date ? new Date(report.session_date).toLocaleDateString('fr-FR') : '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <CreateNoteDialog
        open={createNoteOpen}
        onOpenChange={setCreateNoteOpen}
        projectId={selectedProject}
      />
      
      <NoteDetailsDialog
        open={noteDetailsOpen}
        onOpenChange={setNoteDetailsOpen}
        note={selectedNote ? { ...selectedNote, project: typeof selectedNote.project === 'string' ? selectedNote.project : selectedNote.project?.title || '' } : null}
      />
      
      <TaskDetailsDialog
        open={taskDetailsOpen}
        onOpenChange={setTaskDetailsOpen}
        task={
          selectedTask
            ? {
                ...selectedTask,
                project:
                  typeof selectedTask.project === 'string'
                    ? selectedTask.project
                    : selectedTask.project?.title || '',
              }
            : { id: '', title: '', status: '', dueDate: '', priority: '', project: '' }
        }
      />

      <CreateReportDialog
        open={createReportOpen}
        onOpenChange={setCreateReportOpen}
        projectId={selectedProject}
      />

      <ReportDetailsDialog
        open={reportDetailsOpen}
        onOpenChange={setReportDetailsOpen}
        report={selectedReport ? { ...selectedReport, project: typeof selectedReport.project === 'string' ? selectedReport.project : selectedReport.project?.title || '' } : null}
      />
    </div>
  );
};

export default StudentDashboard;
