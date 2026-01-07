import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FlowData, FlowElement } from '@/types/flow';
import { Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  flowData: FlowData;
}

export function PreviewModal({ isOpen, onClose, flowData }: PreviewModalProps) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const currentScreen = flowData.screens[currentScreenIndex];
  const hasMultipleScreens = flowData.screens.length > 1;

  const goToNextScreen = () => {
    if (currentScreenIndex < flowData.screens.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };

  const goToPrevScreen = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Flow Preview
            {hasMultipleScreens && (
              <span className="text-xs text-muted-foreground ml-2">
                Screen {currentScreenIndex + 1} of {flowData.screens.length}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <div className="relative w-[280px] h-[560px] bg-background rounded-[2rem] border-2 border-border p-2 shadow-2xl">
            {/* Phone Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-card rounded-full z-10" />
            
            {/* Phone Screen */}
            <div className="w-full h-full bg-background rounded-[1.5rem] overflow-hidden flex flex-col">
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
              <div className="flex-1 p-4 space-y-3 overflow-auto">
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

        {/* Screen Navigation */}
        {hasMultipleScreens && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevScreen}
              disabled={currentScreenIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="flex gap-1">
              {flowData.screens.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentScreenIndex(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    idx === currentScreenIndex ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextScreen}
              disabled={currentScreenIndex === flowData.screens.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function renderPreviewElement(element: FlowElement) {
  switch (element.type) {
    case 'text-heading':
      return <p className="text-sm font-bold">{element.properties.text || 'Heading'}</p>;
    case 'text-subheading':
      return <p className="text-xs font-semibold">{element.properties.text || 'Subheading'}</p>;
    case 'text-body':
      return <p className="text-xs text-muted-foreground">{element.properties.text || 'Body text'}</p>;
    case 'text-caption':
      return <p className="text-[10px] text-muted-foreground">{element.properties.text || 'Caption'}</p>;
    case 'image':
      return (
        <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
          {element.properties.src ? (
            <img src={element.properties.src} alt={element.properties.alt || ''} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-xs text-muted-foreground">Image</span>
          )}
        </div>
      );
    case 'image-picker':
      return (
        <div className="w-full h-20 bg-muted rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30">
          <span className="text-lg">🖼️</span>
          <span className="text-[10px] text-muted-foreground">{element.properties.label || 'Upload Image'}</span>
        </div>
      );
    case 'document-picker':
      return (
        <div className="w-full h-16 bg-muted rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30">
          <span className="text-lg">📄</span>
          <span className="text-[10px] text-muted-foreground">{element.properties.label || 'Upload Document'}</span>
        </div>
      );
    case 'text-input':
      return (
        <div className="bg-muted rounded-lg px-3 py-2">
          <span className="text-xs text-muted-foreground">{element.properties.label || 'Input'}</span>
        </div>
      );
    case 'text-area':
      return (
        <div className="bg-muted rounded-lg px-3 py-3 h-16">
          <span className="text-xs text-muted-foreground">{element.properties.label || 'Text area'}</span>
        </div>
      );
    case 'dropdown':
      return (
        <div className="bg-muted rounded-lg px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{element.properties.label || 'Select option'}</span>
          <span className="text-muted-foreground">▼</span>
        </div>
      );
    case 'date-picker':
      return (
        <div className="bg-muted rounded-lg px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{element.properties.label || 'Select date'}</span>
          <span className="text-muted-foreground">📅</span>
        </div>
      );
    case 'calendar-picker':
      return (
        <div className="bg-muted rounded-lg px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {element.properties.label || (element.properties.mode === 'range' ? 'Select date range' : 'Select date')}
          </span>
          <span className="text-muted-foreground">📆</span>
        </div>
      );
    case 'checkbox-group':
      const checkOptions = element.properties.options || [{ id: '1', title: 'Option 1' }, { id: '2', title: 'Option 2' }];
      return (
        <div className="space-y-1">
          {element.properties.label && <p className="text-xs text-muted-foreground mb-1">{element.properties.label}</p>}
          {checkOptions.map((opt: { id: string; title: string }) => (
            <div key={opt.id} className="flex items-center gap-2">
              <div className="w-3 h-3 border border-muted-foreground rounded-sm" />
              <span className="text-xs text-muted-foreground">{opt.title || 'Option'}</span>
            </div>
          ))}
        </div>
      );
    case 'radio-buttons':
      const radioOptions = element.properties.options || [{ id: '1', title: 'Option 1' }, { id: '2', title: 'Option 2' }];
      return (
        <div className="space-y-1">
          {element.properties.label && <p className="text-xs text-muted-foreground mb-1">{element.properties.label}</p>}
          {radioOptions.map((opt: { id: string; title: string }) => (
            <div key={opt.id} className="flex items-center gap-2">
              <div className="w-3 h-3 border border-muted-foreground rounded-full" />
              <span className="text-xs text-muted-foreground">{opt.title || 'Option'}</span>
            </div>
          ))}
        </div>
      );
    case 'opt-in':
      return (
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 border border-muted-foreground rounded mt-0.5" />
          <span className="text-[10px] text-muted-foreground leading-tight">
            {element.properties.text || 'I agree to the terms and conditions'}
          </span>
        </div>
      );
    case 'embedded-link':
      return (
        <div className="text-xs text-primary underline cursor-pointer">
          {element.properties.text || 'Click here'}
        </div>
      );
    case 'navigation-list':
      const navItems = element.properties.items || ['Item 1', 'Item 2'];
      return (
        <div className="space-y-1">
          {navItems.map((item: string, idx: number) => (
            <div key={idx} className="bg-muted rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{item}</span>
              <span className="text-muted-foreground">›</span>
            </div>
          ))}
        </div>
      );
    case 'footer':
      return (
        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-center mt-auto">
          <span className="text-xs font-medium">{element.properties.text || 'Continue'}</span>
        </div>
      );
    default:
      return <span className="text-xs text-muted-foreground">{element.type}</span>;
  }
}