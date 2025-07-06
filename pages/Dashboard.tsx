
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { SupervisorDashboard } from '@/components/supervisor/SupervisorDashboard';

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
