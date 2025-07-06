import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CheckSquare, StickyNote, Calendar, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CreateNoteDialog } from './CreateNoteDialog';
import { NoteDetailsDialog } from './NoteDetailsDialog';
import { TaskDetailsDialog } from './TaskDetailsDialog';
import { CreateReportDialog } from './CreateReportDialog';
import { ReportDetailsDialog } from './ReportDetailsDialog';

// Données fictives
const mockProjects = [
  {
    id: '1',
    title: 'Application Web de Gestion Scolaire',
    type: 'group_project',
    supervisor: 'Dr. Martin Dubois',
    members: ['Alice Martin', 'Bob Dupont', 'Clara Rousseau'],
    progress: 65,
    nextDeadline: '2024-07-15'
  },
  {
    id: '2',
    title: 'Rapport de Stage - Développement Mobile',
    type: 'internship_report',
    supervisor: 'Prof. Sarah Leblanc',
    members: ['Moi'],
    progress: 40,
    nextDeadline: '2024-07-20'
  }
];

const mockTasks = [
  {
    id: '1',
    title: 'Implémenter l\'authentification',
    project: 'Application Web de Gestion Scolaire',
    status: 'in_progress',
    dueDate: '2024-07-10',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Rédiger la documentation API',
    project: 'Application Web de Gestion Scolaire',
    status: 'pending',
    dueDate: '2024-07-12',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Tests unitaires du module utilisateur',
    project: 'Rapport de Stage - Développement Mobile',
    status: 'completed',
    dueDate: '2024-07-05',
    priority: 'low'
  }
];

const mockNotes = [
  {
    id: '1',
    title: 'Réunion équipe - 30 juin',
    project: 'Application Web de Gestion Scolaire',
    content: 'Discussion sur l\'architecture de l\'application...',
    createdAt: '2024-06-30'
  },
  {
    id: '2',
    title: 'Idées pour l\'interface utilisateur',
    project: 'Application Web de Gestion Scolaire',
    content: 'Palette de couleurs, wireframes...',
    createdAt: '2024-06-28'
  }
];

const mockReports = [
  {
    id: '1',
    title: 'Rapport de séance - Semaine 1',
    project: 'Application Web de Gestion Scolaire',
    content: 'Durant cette première séance, nous avons défini l\'architecture générale de l\'application...',
    sessionDate: '2024-07-01',
    createdAt: '2024-07-01'
  },
  {
    id: '2',
    title: 'Rapport d\'avancement - Milestone 1',
    project: 'Rapport de Stage - Développement Mobile',
    content: 'Avancement sur le développement des fonctionnalités principales...',
    sessionDate: '2024-06-28',
    createdAt: '2024-06-28'
  }
];

export const StudentDashboard = () => {
  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [noteDetailsOpen, setNoteDetailsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [createReportOpen, setCreateReportOpen] = useState(false);
  const [reportDetailsOpen, setReportDetailsOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleCreateNote = (projectId: string) => {
    setSelectedProject(projectId);
    setCreateNoteOpen(true);
  };

  const handleCreateReport = (projectId: string) => {
    setSelectedProject(projectId);
    setCreateReportOpen(true);
  };

  const handleNoteClick = (note: any) => {
    setSelectedNote(note);
    setNoteDetailsOpen(true);
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setTaskDetailsOpen(true);
  };

  const handleReportClick = (report: any) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

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
            <div className="text-2xl font-bold">{mockProjects.length}</div>
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
              {mockTasks.filter(t => t.status !== 'completed').length}
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
            <div className="text-2xl font-bold">{mockNotes.length}</div>
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
            <div className="text-2xl font-bold">3</div>
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
            {mockProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  <Badge variant="outline">
                    {getTypeLabel(project.type)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Encadreur: {project.supervisor}
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    Progrès: <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(project.nextDeadline).toLocaleDateString('fr-FR')}
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
            {mockTasks.map((task) => (
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
                  {task.project}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">Échéance:</span>
                    <span className="text-xs font-medium">
                      {new Date(task.dueDate).toLocaleDateString('fr-FR')}
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
              {mockNotes.map((note) => (
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
                    <span>{note.project}</span>
                    <span>{new Date(note.createdAt).toLocaleDateString('fr-FR')}</span>
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
              {mockReports.map((report) => (
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
                    <span>{report.project}</span>
                    <span>Séance: {new Date(report.sessionDate).toLocaleDateString('fr-FR')}</span>
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
        note={selectedNote}
      />
      
      <TaskDetailsDialog
        open={taskDetailsOpen}
        onOpenChange={setTaskDetailsOpen}
        task={selectedTask}
      />

      <CreateReportDialog
        open={createReportOpen}
        onOpenChange={setCreateReportOpen}
        projectId={selectedProject}
      />

      <ReportDetailsDialog
        open={reportDetailsOpen}
        onOpenChange={setReportDetailsOpen}
        report={selectedReport}
      />
    </div>
  );
};
