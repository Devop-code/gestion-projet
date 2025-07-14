
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from '@/app/admin/page';
import { StudentDashboard } from '@/app/student/page';
import { SupervisorDashboard } from '@/app/supervisor/page';

export const Dashboard = () => {
  const { profile } = useAuth();

  if (!profile) {
    return <div>Chargement...</div>;
  }

  switch (profile.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'supervisor':
      return <SupervisorDashboard />;
    default:
      return <div>Rôle non reconnu</div>;
  }
};
