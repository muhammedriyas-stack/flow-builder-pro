import { useState, useRef, useCallback } from 'react';
import { FlowScreen, FlowElement, FlowElementType, ELEMENT_CATEGORIES } from '@/types/flow';
import { Plus, X, Smartphone, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FlowCanvasProps {
  screens: FlowScreen[];
  selectedScreen: string | null;
  selectedElement: string | null;
  onScreenSelect: (screenId: string) => void;
  onElementSelect: (elementId: string | null) => void;
  onAddScreen: () => void;
  onRemoveScreen: (screenId: string) => void;
  onAddElement: (screenId: string, type: FlowElementType, position: { x: number; y: number }) => void;
  onRemoveElement: (screenId: string, elementId: string) => void;
  onElementMove: (screenId: string, elementId: string, position: { x: number; y: number }) => void;
}

const getElementLabel = (type: FlowElementType): string => {
  for (const category of ELEMENT_CATEGORIES) {
    const element = category.elements.find(e => e.type === type);
    if (element) return element.label;
  }
  return type;
};

export function FlowCanvas({
  screens,
  selectedScreen,
  selectedElement,
  onScreenSelect,
  onElementSelect,
  onAddScreen,
  onRemoveScreen,
  onAddElement,
  onRemoveElement,
  onElementMove
}: FlowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragOverScreen, setDragOverScreen] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent, screenId: string) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('elementType') as FlowElementType;
    if (!elementType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    onAddElement(screenId, elementType, position);
    setDragOverScreen(null);
  }, [onAddElement]);

  const handleDragOver = useCallback((e: React.DragEvent, screenId: string) => {
    e.preventDefault();
    setDragOverScreen(screenId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverScreen(null);
  }, []);

  return (
    <div 
      ref={canvasRef}
      className="flex-1 bg-canvas canvas-grid overflow-auto p-8"
      onClick={() => onElementSelect(null)}
    >
      <div className="flex gap-6 min-w-max">
        {screens.map((screen, index) => (
          <div
            key={screen.id}
            className={cn(
              "animate-fade-in",
              selectedScreen === screen.id && "ring-2 ring-primary ring-offset-2 ring-offset-canvas rounded-2xl"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Screen Header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Screen {index + 1}
                </span>
                <span className="text-xs text-muted-foreground/50">•</span>
                <input
                  type="text"
                  value={screen.title}
                  className="text-xs bg-transparent border-none text-muted-foreground focus:outline-none focus:text-foreground w-24"
                  placeholder="Screen title"
                  readOnly
                />
              </div>
              {screens.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveScreen(screen.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            {/* Phone Frame */}
            <div
              className={cn(
                "relative w-[320px] h-[640px] bg-card rounded-[2.5rem] border-2 border-border p-3 shadow-2xl cursor-pointer transition-all duration-200",
                dragOverScreen === screen.id && "border-primary bg-primary/5"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onScreenSelect(screen.id);
              }}
              onDrop={(e) => handleDrop(e, screen.id)}
              onDragOver={(e) => handleDragOver(e, screen.id)}
              onDragLeave={handleDragLeave}
            >
              {/* Phone Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-background rounded-full" />
              
              {/* Phone Screen */}
              <div className="absolute top-12 left-3 right-3 bottom-3 bg-background rounded-[1.5rem] overflow-hidden">
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
                    <p className="text-xs font-medium text-primary-foreground">{screen.title || 'Flow Screen'}</p>
                    <p className="text-[10px] text-primary-foreground/70">Business Account</p>
                  </div>
                </div>

                {/* Content Area */}
                <div 
                  className="flex-1 p-4 space-y-3 overflow-auto"
                  style={{ height: 'calc(100% - 6rem)' }}
                >
                  {screen.elements.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Smartphone className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-xs text-center">
                        Drag elements here<br />to build your flow
                      </p>
                    </div>
                  ) : (
                    screen.elements.map((element) => (
                      <FlowElementNode
                        key={element.id}
                        element={element}
                        isSelected={selectedElement === element.id}
                        onSelect={(e) => {
                          e.stopPropagation();
                          onElementSelect(element.id);
                        }}
                        onRemove={() => onRemoveElement(screen.id, element.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Screen Button */}
        <button
          onClick={onAddScreen}
          className="w-[320px] h-[640px] rounded-[2.5rem] border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-colors bg-card/30"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium">Add Screen</span>
        </button>
      </div>
    </div>
  );
}

interface FlowElementNodeProps {
  element: FlowElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onRemove: () => void;
}

function FlowElementNode({ element, isSelected, onSelect, onRemove }: FlowElementNodeProps) {
  const renderElement = () => {
    switch (element.type) {
      case 'text-heading':
        return <p className="text-sm font-bold text-foreground">{element.properties.text || 'Heading'}</p>;
      case 'text-subheading':
        return <p className="text-xs font-semibold text-foreground">{element.properties.text || 'Subheading'}</p>;
      case 'text-body':
        return <p className="text-xs text-muted-foreground">{element.properties.text || 'Body text goes here'}</p>;
      case 'text-caption':
        return <p className="text-[10px] text-muted-foreground">{element.properties.text || 'Caption'}</p>;
      case 'image':
        return (
          <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Image</span>
          </div>
        );
      case 'text-input':
        return (
          <div className="bg-muted rounded-lg px-3 py-2">
            <span className="text-xs text-muted-foreground">{element.properties.label || 'Text input'}</span>
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
      case 'footer':
        return (
          <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-center">
            <span className="text-xs font-medium">{element.properties.text || 'Continue'}</span>
          </div>
        );
      case 'checkbox-group':
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-muted-foreground rounded-sm" />
              <span className="text-xs text-muted-foreground">Option 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-muted-foreground rounded-sm" />
              <span className="text-xs text-muted-foreground">Option 2</span>
            </div>
          </div>
        );
      case 'radio-buttons':
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-muted-foreground rounded-full" />
              <span className="text-xs text-muted-foreground">Option 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-muted-foreground rounded-full" />
              <span className="text-xs text-muted-foreground">Option 2</span>
            </div>
          </div>
        );
      case 'date-picker':
        return (
          <div className="bg-muted rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{element.properties.label || 'Select date'}</span>
            <span className="text-muted-foreground">📅</span>
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
      default:
        return <span className="text-xs text-muted-foreground">{getElementLabel(element.type)}</span>;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative p-2 rounded-lg transition-all cursor-pointer group",
        isSelected ? "bg-primary/10 ring-1 ring-primary" : "hover:bg-muted/50"
      )}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
      {renderElement()}
    </div>
  );
}
