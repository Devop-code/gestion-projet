import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, FolderOpen, FileText, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateProjectDialog } from './CreateProjectDialog';
import { CreateReportDialog } from './CreateReportDialog';
import { ProjectDetailsDialog } from './ProjectDetailsDialog';

// Données fictives
const mockProjects = [
  {
    id: '1',
    title: 'Application E-commerce',
    description: 'Développement d\'une application e-commerce complète avec panier, paiement et gestion des commandes.',
    type: 'group_project',
    supervisor: 'Dr. Martin Dubois',
    members: 4,
    createdAt: '2024-01-15',
    status: 'in_progress'
  },
  {
    id: '2',
    title: 'Système de Gestion RH',
    description: 'Création d\'un système de gestion des ressources humaines pour une entreprise moyenne.',
    type: 'internship_report',
    supervisor: 'Prof. Sarah Leblanc',
    members: 1,
    createdAt: '2024-02-10',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Application Mobile Fitness',
    description: 'Application mobile pour le suivi des activités sportives et de la nutrition.',
    type: 'group_project',
    supervisor: 'Dr. Pierre Moreau',
    members: 3,
    createdAt: '2024-01-28',
    status: 'in_progress'
  }
];

export const AdminDashboard = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null);

  const getTypeLabel = (type: string) => {
    return type === 'group_project' ? 'Projet de groupe' : 'Rapport de stage';
  };

  const handleProjectClick = (project: typeof mockProjects[0]) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              +5 nouveaux cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports en attente</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
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
            Gérez tous les projets de l'université
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
              {mockProjects.map((project) => (
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
                  <TableCell>{project.supervisor}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{project.members}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(project.createdAt).toLocaleDateString('fr-FR')}
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
