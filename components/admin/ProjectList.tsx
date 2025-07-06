import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Project, Profile } from '@/types/database';

interface ProjectWithDetails extends Project {
  supervisor: Profile | null;
  project_members: {
    student: Profile;
  }[];
}

export const ProjectList = () => {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          supervisor:supervisor_id(first_name, last_name),
          project_members(
            student:student_id(first_name, last_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    return type === 'group_project' ? 'Projet de groupe' : 'Rapport de stage';
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
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
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getTypeLabel(project.type)}
                </Badge>
              </TableCell>
              <TableCell>
                {project.supervisor ? 
                  `${project.supervisor.first_name} ${project.supervisor.last_name}` : 
                  'Non assigné'
                }
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{project.project_members.length}</span>
                </div>
              </TableCell>
              <TableCell>
                {new Date(project.created_at).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
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
    </div>
  );
};
