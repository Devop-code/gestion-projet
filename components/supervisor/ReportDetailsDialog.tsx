
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface Report {
  id: string;
  title: string;
  type: string;
  project: string;
  student: string;
  content: string;
  date: string;
  status: string;
}

interface ReportDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report | null;
}

export const ReportDetailsDialog = ({ open, onOpenChange, report }: ReportDetailsDialogProps) => {
  if (!report) return null;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'evaluation': return 'Évaluation';
      case 'progress': return 'Suivi de progrès';
      case 'feedback': return "Retour d'expérience";
      case 'milestone': return 'Jalon de projet';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'read': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyé';
      case 'read': return 'Lu';
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {report.title}
            <Badge variant={getStatusColor(report.status)}>
              {getStatusLabel(report.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Détails du rapport créé le {new Date(report.date).toLocaleDateString('fr-FR')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Type</h4>
              <p className="text-sm">{getTypeLabel(report.type)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Étudiant</h4>
              <p className="text-sm">{report.student}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-1">Projet concerné</h4>
            <p className="text-sm">{report.project}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Contenu du rapport</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{report.content}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button variant="outline">
              Modifier
            </Button>
            <Button>
              Envoyer à l'étudiant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
