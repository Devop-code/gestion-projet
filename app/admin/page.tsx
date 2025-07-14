"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, FolderOpen, FileText, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateProjectDialog } from '../../components/admin/CreateProjectDialog';
import { CreateReportDialog } from '../../components/admin/CreateReportDialog';
import { ProjectDetailsDialog } from '../../components/admin/ProjectDetailsDialog';

interface Project {
  id: string;
  title: string;
  description: string;
  type: string;
  supervisor?: { first_name: string; last_name: string } | string;
  members?: { student: { id: string } }[];
  createdAt?: string;
  status?: string;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface SessionReport {
  id: string;
  is_validated?: boolean;
}

export const AdminDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [reports, setReports] = useState<SessionReport[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(setProjects);
    fetch('/api/profiles')
      .then(res => res.json())
      .then(setUsers);
    fetch('/api/sessionreports')
      .then(res => res.json())
      .then(setReports);
  }, []);

  const getTypeLabel = (type: string) => {
    return type === 'group_project' ? 'Projet de groupe' : 'Rapport de stage';
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const activeProjects = projects.filter(p => p.status === 'in_progress');
  const pendingReports = reports.filter(r => r.is_validated === false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tableau de bord Administrateur</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateReport(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Rapport
          </Button>
          <Button onClick={() => setShowCreateProject(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Projet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              +{activeProjects.length - 10 > 0 ? activeProjects.length - 10 : 0} depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              +{users.length - 43 > 0 ? users.length - 43 : 0} nouveaux cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports en attente</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports.length}</div>
            <p className="text-xs text-muted-foreground">
              À valider
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projets</CardTitle>
          <CardDescription>
            Gérez tous les projets de l université
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Encadreur</TableHead>
                <TableHead>Membres</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow 
                  key={project.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleProjectClick(project)}
                >
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTypeLabel(project.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {typeof project.supervisor === 'string'
                      ? project.supervisor
                      : project.supervisor
                      ? `${project.supervisor.first_name} ${project.supervisor.last_name}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{project.members ? project.members.length : 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString('fr-FR') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
      />

      <CreateReportDialog
        open={showCreateReport}
        onOpenChange={setShowCreateReport}
      />

      <ProjectDetailsDialog
        open={showProjectDetails}
        onOpenChange={setShowProjectDetails}
        project={selectedProject}
      />
    </div>
  );
};
export default AdminDashboard;