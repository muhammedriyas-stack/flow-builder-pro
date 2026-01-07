import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FlowData } from '@/types/flow';
import { Smartphone } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  flowData: FlowData;
}

export function PreviewModal({ isOpen, onClose, flowData }: PreviewModalProps) {
  const currentScreen = flowData.screens[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Flow Preview
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <div className="w-[280px] h-[560px] bg-background rounded-[2rem] border-2 border-border p-2 shadow-2xl">
            {/* Phone Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-card rounded-full" />
            
            {/* Phone Screen */}
            <div className="w-full h-full bg-background rounded-[1.5rem] overflow-hidden">
              {/* Status Bar */}
              <div className="h-6 bg-muted/30 flex items-center justify-between px-4 text-[10px] text-muted-foreground">
                <span>9:41</span>
                <div className="flex gap-1">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* WhatsApp Header */}
              <div className="h-12 bg-primary flex items-center px-4 gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20" />
                <div>
                  <p className="text-xs font-medium text-primary-foreground">
                    {currentScreen?.title || 'Flow Preview'}
                  </p>
                  <p className="text-[10px] text-primary-foreground/70">Business Account</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3" style={{ height: 'calc(100% - 4.5rem)' }}>
                {currentScreen?.elements.map((element) => (
                  <div key={element.id} className="animate-fade-in">
                    {renderPreviewElement(element)}
                  </div>
                ))}

                {(!currentScreen || currentScreen.elements.length === 0) && (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No elements added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function renderPreviewElement(element: any) {
  switch (element.type) {
    case 'text-heading':
      return <p className="text-sm font-bold">{element.properties.text || 'Heading'}</p>;
    case 'text-subheading':
      return <p className="text-xs font-semibold">{element.properties.text || 'Subheading'}</p>;
    case 'text-body':
      return <p className="text-xs text-muted-foreground">{element.properties.text || 'Body text'}</p>;
    case 'text-input':
      return (
        <div className="bg-muted rounded-lg px-3 py-2">
          <span className="text-xs text-muted-foreground">{element.properties.label || 'Input'}</span>
        </div>
      );
    case 'footer':
      return (
        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-center mt-auto">
          <span className="text-xs font-medium">{element.properties.text || 'Continue'}</span>
        </div>
      );
    default:
      return null;
  }
}
