
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Report {
  id: string;
  title: string;
  project: string;
  content: string;
  sessionDate: string;
  createdAt: string;
}

interface ReportDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report | null;
}

export const ReportDetailsDialog = ({ open, onOpenChange, report }: ReportDetailsDialogProps) => {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{report.title}</DialogTitle>
          <DialogDescription>
            Rapport créé le {new Date(report.createdAt).toLocaleDateString('fr-FR')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Projet</h4>
              <p className="text-sm">{report.project}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Date de séance</h4>
              <p className="text-sm">{new Date(report.sessionDate).toLocaleDateString('fr-FR')}</p>
            </div>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
