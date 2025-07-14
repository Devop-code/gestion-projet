"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CheckSquare, Users, Clock, Edit } from 'lucide-react';
import { CreateTaskListDialog } from '../../components/supervisor/CreateTaskListDialog';
import { CreateTaskDialog } from '../../components/supervisor/CreateTaskDialog';
import { TaskListDetailsDialog } from '../../components/supervisor/TaskListDetailsDialog';
import { CreateReportDialog } from '../../components/supervisor/CreateReportDialog';
import { ReportDetailsDialog } from '../../components/supervisor/ReportDetailsDialog';
import { useAuth } from '@/hooks/useAuth';
import type { Report as DialogReport } from '../../components/supervisor/ReportDetailsDialog';

interface Project {
  id: string;
  title: string;
  type: string;
  members: { student: { first_name: string; last_name: string } }[];
  progress?: number;
}

interface Report {
  id: string;
  title: string;
  content: string;
  project?: { title: string };
  author?: { first_name: string; last_name: string };
  is_validated?: boolean;
  createdAt?: string;
  session_date?: string;
  status?: string;
}

interface TaskList {
  id: string;
  title: string;
  project?: { id: string; title: string };
  tasks?: { status: string }[];
}

// Type pour le report tel que reçu du backend
type ReportBackend = {
  id: string;
  title: string;
  type?: string;
  project?: { title?: string };
  author?: { first_name?: string; last_name?: string };
  content: string;
  createdAt?: string;
  session_date?: string;
  status?: string;
};

// Utilitaire pour transformer un report backend en report frontend pour le dialog
function toDialogReport(report: ReportBackend): DialogReport {
  return {
    id: report.id,
    title: report.title,
    type: report.type || '',
    project: report.project?.title || '',
    student: report.author ? `${report.author.first_name} ${report.author.last_name}` : '',
    content: report.content,
    date: report.session_date || report.createdAt || '',
    status: report.status || '',
  };
}

export const SupervisorDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]); // à valider
  const [createdReports, setCreatedReports] = useState<Report[]>([]); // créés par le superviseur
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);

  const [createTaskListOpen, setCreateTaskListOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [taskListDetailsOpen, setTaskListDetailsOpen] = useState(false);
  const [createReportOpen, setCreateReportOpen] = useState(false);
  const [reportDetailsOpen, setReportDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTaskList, setSelectedTaskList] = useState<TaskList | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);

    // Charger les projets supervisés
    fetch(`/api/projects?supervisor_id=${user.id}`)
      .then(res => res.json())
      .then((data: Project[]) => {
        setProjects(data);

        // Charger toutes les listes de tâches des projets supervisés
        const projectIds = new Set(data.map(p => p.id));
        fetch(`/api/tasklists`)
          .then(res => res.json())
          .then((taskListsData: TaskList[]) => {
            setTaskLists(taskListsData.filter(tl => tl.project && projectIds.has(tl.project.id)));
          })
          .finally(() => setLoading(false));
      });

    // Charger les rapports à valider (is_validated: false)
    fetch(`/api/sessionreports?validated_by=${user.id}`)
      .then(res => res.json())
      .then((data: Report[]) => setReports(data.filter(r => !r.is_validated)));

    // Charger les rapports créés par le superviseur
    fetch(`/api/sessionreports?author_id=${user.id}`)
      .then(res => res.json())
      .then((data: Report[]) => setCreatedReports(data));
  }, [user]);

  const handleCreateTaskList = (projectId: string) => {
    setSelectedProject(projectId);
    setCreateTaskListOpen(true);
  };

  const handleTaskListClick = (taskList: TaskList) => {
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

  const handleReportClick = (report: Report) => {
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

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

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
            <div className="text-2xl font-bold">{projects.length}</div>
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
            <div className="text-2xl font-bold">{taskLists.length}</div>
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
            <div className="text-2xl font-bold">{reports.length}</div>
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
            <div className="text-2xl font-bold">{[...new Set(projects.flatMap(p => p.members.map(m => m.student ? m.student.first_name + ' ' + m.student.last_name : '-')))].length}</div>
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
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {getTypeLabel(project.type)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Étudiants: {project.members.map(m => m.student ? m.student.first_name + ' ' + m.student.last_name : '-').join(', ')}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Progrès:</span>
                    <span className={`font-semibold ${getProgressColor(project.progress || 0)}`}>
                      {project.progress || '-'}%
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
            {createdReports.map((report) => (
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
                  Étudiant: {report.author ? report.author.first_name + ' ' + report.author.last_name : '-'}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    Projet: <span className="font-medium">{report.project ? report.project.title : '-'}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString('fr-FR') : '-'}
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
            {reports.map((report) => (
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
                  Projet: {report.project ? report.project.title : '-'}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    Par: <span className="font-medium">{report.author ? report.author.first_name + ' ' + report.author.last_name : '-'}</span>
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

      {/* Listes de tâches dynamiques */}
      <Card>
        <CardHeader>
          <CardTitle>Listes de tâches</CardTitle>
          <CardDescription>
            Listes de tâches créées pour vos projets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskLists.map((taskList) => {
              const completedCount = taskList.tasks ? taskList.tasks.filter(t => t.status === 'completed').length : 0;
              const tasksCount = taskList.tasks ? taskList.tasks.length : 0;
              return (
                <div 
                  key={taskList.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleTaskListClick(taskList)}
                >
                  <h3 className="font-semibold mb-2">{taskList.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{taskList.project ? taskList.project.title : '-'}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span>{completedCount}/{tasksCount} tâches terminées</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${tasksCount > 0 ? (completedCount / tasksCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
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
        taskListId={selectedTaskList?.id || ''}
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
        report={selectedReport ? toDialogReport(selectedReport as ReportBackend) : null}
      />
    </div>
  );
};
export default SupervisorDashboard;