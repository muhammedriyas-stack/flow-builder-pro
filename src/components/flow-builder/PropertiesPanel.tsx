import { FlowElement, FlowScreen, ELEMENT_CATEGORIES } from '@/types/flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings2, FileText, Layout } from 'lucide-react';

interface PropertiesPanelProps {
  selectedScreen: FlowScreen | null;
  selectedElement: FlowElement | null;
  onScreenUpdate: (screen: FlowScreen) => void;
  onElementUpdate: (element: FlowElement) => void;
}

const getElementLabel = (type: string): string => {
  for (const category of ELEMENT_CATEGORIES) {
    const element = category.elements.find(e => e.type === type);
    if (element) return element.label;
  }
  return type;
};

export function PropertiesPanel({
  selectedScreen,
  selectedElement,
  onScreenUpdate,
  onElementUpdate
}: PropertiesPanelProps) {
  if (selectedElement) {
    return (
      <div className="w-72 bg-sidebar border-l border-sidebar-border flex flex-col h-full">
        <div className="panel-header flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          <span>Element Properties</span>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Type</span>
              </div>
              <p className="text-sm text-foreground font-medium pl-6">
                {getElementLabel(selectedElement.type)}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Layout className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Content</span>
              </div>

              {renderElementProperties(selectedElement, onElementUpdate)}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (selectedScreen) {
    return (
      <div className="w-72 bg-sidebar border-l border-sidebar-border flex flex-col h-full">
        <div className="panel-header flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          <span>Screen Properties</span>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Screen Title</Label>
              <Input
                value={selectedScreen.title}
                onChange={(e) => onScreenUpdate({ ...selectedScreen, title: e.target.value })}
                className="bg-sidebar-accent border-sidebar-border"
                placeholder="Enter screen title"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Screen ID</Label>
              <Input
                value={selectedScreen.id}
                disabled
                className="bg-sidebar-accent/50 border-sidebar-border text-muted-foreground font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs text-muted-foreground">Terminal Screen</Label>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Ends the flow</p>
              </div>
              <Switch
                checked={selectedScreen.terminal || false}
                onCheckedChange={(checked) => onScreenUpdate({ ...selectedScreen, terminal: checked })}
              />
            </div>

            <div className="pt-4 border-t border-sidebar-border">
              <p className="text-xs text-muted-foreground">
                Elements: {selectedScreen.elements.length}
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="w-72 bg-sidebar border-l border-sidebar-border flex flex-col h-full">
      <div className="panel-header flex items-center gap-2">
        <Settings2 className="w-4 h-4" />
        <span>Properties</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 text-center">
        <div className="text-muted-foreground">
          <Settings2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Select a screen or element to view its properties</p>
        </div>
      </div>
    </div>
  );
}

function renderElementProperties(element: FlowElement, onUpdate: (element: FlowElement) => void) {
  const updateProperty = (key: string, value: any) => {
    onUpdate({
      ...element,
      properties: { ...element.properties, [key]: value }
    });
  };

  switch (element.type) {
    case 'text-heading':
    case 'text-subheading':
    case 'text-body':
    case 'text-caption':
      return (
        <div className="space-y-2 pl-6">
          <Label className="text-xs text-muted-foreground">Text Content</Label>
          <Textarea
            value={element.properties.text || ''}
            onChange={(e) => updateProperty('text', e.target.value)}
            className="bg-sidebar-accent border-sidebar-border min-h-[80px]"
            placeholder="Enter text content..."
          />
        </div>
      );

    case 'text-input':
    case 'text-area':
    case 'dropdown':
    case 'date-picker':
      return (
        <div className="space-y-4 pl-6">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Label</Label>
            <Input
              value={element.properties.label || ''}
              onChange={(e) => updateProperty('label', e.target.value)}
              className="bg-sidebar-accent border-sidebar-border"
              placeholder="Field label"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Name (variable)</Label>
            <Input
              value={element.properties.name || ''}
              onChange={(e) => updateProperty('name', e.target.value)}
              className="bg-sidebar-accent border-sidebar-border font-mono text-xs"
              placeholder="field_name"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Required</Label>
            <Switch
              checked={element.properties.required || false}
              onCheckedChange={(checked) => updateProperty('required', checked)}
            />
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className="space-y-4 pl-6">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Button Text</Label>
            <Input
              value={element.properties.text || ''}
              onChange={(e) => updateProperty('text', e.target.value)}
              className="bg-sidebar-accent border-sidebar-border"
              placeholder="Continue"
            />
          </div>
        </div>
      );

    case 'opt-in':
      return (
        <div className="space-y-4 pl-6">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Consent Text</Label>
            <Textarea
              value={element.properties.text || ''}
              onChange={(e) => updateProperty('text', e.target.value)}
              className="bg-sidebar-accent border-sidebar-border min-h-[80px]"
              placeholder="I agree to..."
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Required</Label>
            <Switch
              checked={element.properties.required || false}
              onCheckedChange={(checked) => updateProperty('required', checked)}
            />
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4 pl-6">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Image URL</Label>
            <Input
              value={element.properties.src || ''}
              onChange={(e) => updateProperty('src', e.target.value)}
              className="bg-sidebar-accent border-sidebar-border"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Alt Text</Label>
            <Input
              value={element.properties.alt || ''}
              onChange={(e) => updateProperty('alt', e.target.value)}
              className="bg-sidebar-accent border-sidebar-border"
              placeholder="Image description"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="pl-6">
          <p className="text-xs text-muted-foreground">No editable properties</p>
        </div>
      );
  }
}
