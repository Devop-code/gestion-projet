
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  project: string;
  createdAt: string;
  author?: string;
}

interface NoteDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note | null;
}

export const NoteDetailsDialog = ({ open, onOpenChange, note }: NoteDetailsDialogProps) => {
  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
          <DialogDescription className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(note.createdAt).toLocaleDateString('fr-FR')}
            </span>
            {note.author && (
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {note.author}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">Projet</h4>
            <p className="text-sm">{note.project}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">Contenu</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
