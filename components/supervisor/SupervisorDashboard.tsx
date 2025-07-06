import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CheckSquare, Users, Clock, Edit } from 'lucide-react';
import { CreateTaskListDialog } from './CreateTaskListDialog';
import { CreateTaskDialog } from './CreateTaskDialog';
import { TaskListDetailsDialog } from './TaskListDetailsDialog';
import { CreateReportDialog } from './CreateReportDialog';
import { ReportDetailsDialog } from './ReportDetailsDialog';

// Données fictives
const mockProjects = [
  {
    id: '1',
    title: 'Application Web de Gestion Scolaire',
    type: 'group_project',
    students: ['Alice Martin', 'Bob Dupont', 'Clara Rousseau'],
    progress: 65,
    lastUpdate: '2024-07-01'
  },
  {
    id: '2',
    title: 'Rapport de Stage - Développement Mobile',
    type: 'internship_report',
    students: ['David Leclerc'],
    progress: 40,
    lastUpdate: '2024-06-28'
  },
  {
    id: '3',
    title: 'Système de Recommandation IA',
    type: 'group_project',
    students: ['Emma Bernard', 'François Petit'],
    progress: 80,
    lastUpdate: '2024-07-02'
  }
];

const mockReports = [
  {
    id: '1',
    title: 'Rapport Hebdomadaire - Semaine 1',
    project: 'Application Web de Gestion Scolaire',
    student: 'Alice Martin',
    date: '2024-06-30',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Rapport de Progress - Module Auth',
    project: 'Système de Recommandation IA',
    student: 'Emma Bernard',
    date: '2024-07-01',
    status: 'pending'
  }
];

// Données fictives pour les rapports créés
const mockCreatedReports = [
  {
    id: '1',
    title: 'Évaluation mi-parcours - Alice',
    type: 'evaluation',
    project: 'Application Web de Gestion Scolaire',
    student: 'Alice Martin',
    content: 'Alice montre de très bons progrès sur le projet. Son travail sur le module d\'authentification est exemplaire. Points à améliorer : documentation du code et tests unitaires.',
    date: '2024-07-01',
    status: 'sent'
  },
  {
    id: '2',
    title: 'Suivi hebdomadaire - Emma',
    type: 'progress',
    project: 'Système de Recommandation IA',
    student: 'Emma Bernard',
    content: 'Bon avancement sur l\'algorithme de recommandation. Emma a bien compris les concepts de machine learning appliqués. Prochaine étape : optimisation des performances.',
    date: '2024-06-30',
    status: 'draft'
  }
];

export const SupervisorDashboard = () => {
  const [createTaskListOpen, setCreateTaskListOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [taskListDetailsOpen, setTaskListDetailsOpen] = useState(false);
  const [createReportOpen, setCreateReportOpen] = useState(false);
  const [reportDetailsOpen, setReportDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTaskList, setSelectedTaskList] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleCreateTaskList = (projectId: string) => {
    setSelectedProject(projectId);
    setCreateTaskListOpen(true);
  };

  const handleTaskListClick = (taskList: any) => {
    setSelectedTaskList(taskList);
    setTaskListDetailsOpen(true);
  };

  const handleCreateTaskFromList = () => {
    setTaskListDetailsOpen(false);
    setCreateTaskOpen(true);
  };

  const handleCreateReport = () => {
    setCreateReportOpen(true);
  };

  const handleReportClick = (report: any) => {
    setSelectedReport(report);
    setReportDetailsOpen(true);
  };

  const getTypeLabel = (type: string) => {
    return type === 'group_project' ? 'Projet de groupe' : 'Rapport de stage';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tableau de bord Encadreur</h2>
        <Button onClick={handleCreateReport}>
          <Plus className="h-4 w-4 mr-2" />
          Créer un rapport
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets supervisés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Listes de tâches</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Créées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReports.length}</div>
            <p className="text-xs text-muted-foreground">
              À valider
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Sous supervision
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes Projets</CardTitle>
            <CardDescription>
              Projets que vous supervisez actuellement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {getTypeLabel(project.type)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Étudiants: {project.students.join(', ')}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Progrès:</span>
                    <span className={`font-semibold ${getProgressColor(project.progress)}`}>
                      {project.progress}%
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCreateTaskList(project.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Tâches
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Rapports
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes rapports</CardTitle>
            <CardDescription>
              Rapports que vous avez créés pour vos étudiants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockCreatedReports.map((report) => (
              <div 
                key={report.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleReportClick(report)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{report.title}</h3>
                  <div className="flex items-center text-xs text-blue-600">
                    <Edit className="h-3 w-3 mr-1" />
                    {report.status === 'draft' ? 'Brouillon' : 'Envoyé'}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Étudiant: {report.student}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    Projet: <span className="font-medium">{report.project}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(report.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rapports en attente</CardTitle>
            <CardDescription>
              Rapports soumis par vos étudiants à valider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockReports.map((report) => (
              <div 
                key={report.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleReportClick(report)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{report.title}</h3>
                  <div className="flex items-center text-xs text-orange-600">
                    <Clock className="h-3 w-3 mr-1" />
                    En attente
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Projet: {report.project}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    Par: <span className="font-medium">{report.student}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Voir
                    </Button>
                    <Button size="sm">
                      Valider
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Listes de tâches simulées */}
      <Card>
        <CardHeader>
          <CardTitle>Listes de tâches</CardTitle>
          <CardDescription>
            Listes de tâches créées pour vos projets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: '1', title: 'Sprint 1 - Authentification', project: 'Application Web de Gestion Scolaire', tasksCount: 5, completedCount: 2 },
              { id: '2', title: 'Phase de développement', project: 'Système de Recommandation IA', tasksCount: 8, completedCount: 6 },
              { id: '3', title: 'Tests et validation', project: 'Application Web de Gestion Scolaire', tasksCount: 3, completedCount: 1 }
            ].map((taskList) => (
              <div 
                key={taskList.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleTaskListClick(taskList)}
              >
                <h3 className="font-semibold mb-2">{taskList.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{taskList.project}</p>
                <div className="flex justify-between items-center text-sm">
                  <span>{taskList.completedCount}/{taskList.tasksCount} tâches terminées</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(taskList.completedCount / taskList.tasksCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateTaskListDialog
        open={createTaskListOpen}
        onOpenChange={setCreateTaskListOpen}
        projectId={selectedProject}
      />
      
      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        taskListId="1"
      />
      
      <TaskListDetailsDialog
        open={taskListDetailsOpen}
        onOpenChange={setTaskListDetailsOpen}
        taskList={selectedTaskList}
        onCreateTask={handleCreateTaskFromList}
      />

      <CreateReportDialog
        open={createReportOpen}
        onOpenChange={setCreateReportOpen}
      />
      
      <ReportDetailsDialog
        open={reportDetailsOpen}
        onOpenChange={setReportDetailsOpen}
        report={selectedReport}
      />
    </div>
  );
};
