import { useState, useCallback } from 'react';
import { Header } from './Header';
import { ElementPalette } from './ElementPalette';
import { FlowCanvas } from './FlowCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { JsonPreview } from './JsonPreview';
import { PreviewModal } from './PreviewModal';
import { FlowScreen, FlowElement, FlowElementType, FlowData, Client } from '@/types/flow';
import { toast } from 'sonner';

// Mock clients - in production, fetch from your MongoDB via API
const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Acme Corp', phone_number_id: '123456789', waba_id: 'waba_001', has_access_token: true },
  { id: '2', name: 'Tech Solutions', phone_number_id: '987654321', waba_id: 'waba_002', has_access_token: true },
  { id: '3', name: 'Digital Agency', phone_number_id: '456789123', waba_id: 'waba_003', has_access_token: false },
  { id: '4', name: 'StartupXYZ', phone_number_id: '789123456', waba_id: 'waba_004', has_access_token: true },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper to convert internal FlowScreen to API FlowData format
const convertToApiFormat = (screens: FlowScreen[]): FlowData => ({
  version: '3.0',
  screens: screens.map(screen => ({
    id: screen.id,
    title: screen.title,
    elements: screen.elements,
    terminal: screen.terminal
  }))
});

export function FlowBuilder() {
  const [flowName, setFlowName] = useState('Untitled Flow');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [screens, setScreens] = useState<FlowScreen[]>([
    { id: 'screen_1', title: 'Welcome', elements: [] }
  ]);
  const [selectedScreen, setSelectedScreen] = useState<string>('screen_1');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [jsonCollapsed, setJsonCollapsed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedElementType, setDraggedElementType] = useState<FlowElementType | null>(null);

  const flowData: FlowData = convertToApiFormat(screens);

  const handleAddScreen = useCallback(() => {
    const newScreen: FlowScreen = {
      id: `screen_${generateId()}`,
      title: `Screen ${screens.length + 1}`,
      elements: []
    };
    setScreens([...screens, newScreen]);
    setSelectedScreen(newScreen.id);
    toast.success('Screen added');
  }, [screens]);

  const handleRemoveScreen = useCallback((screenId: string) => {
    if (screens.length <= 1) {
      toast.error('Cannot remove the only screen');
      return;
    }
    setScreens(screens.filter(s => s.id !== screenId));
    if (selectedScreen === screenId) {
      setSelectedScreen(screens[0].id);
    }
    setSelectedElement(null);
    toast.success('Screen removed');
  }, [screens, selectedScreen]);

  const handleAddElement = useCallback((screenId: string, type: FlowElementType, position: { x: number; y: number }) => {
    const newElement: FlowElement = {
      id: `element_${generateId()}`,
      type,
      name: `${type}_${generateId()}`,
      properties: {},
      position
    };

    setScreens(screens.map(screen => {
      if (screen.id === screenId) {
        return { ...screen, elements: [...screen.elements, newElement] };
      }
      return screen;
    }));
    setSelectedElement(newElement.id);
  }, [screens]);

  const handleRemoveElement = useCallback((screenId: string, elementId: string) => {
    setScreens(screens.map(screen => {
      if (screen.id === screenId) {
        return { ...screen, elements: screen.elements.filter(el => el.id !== elementId) };
      }
      return screen;
    }));
    setSelectedElement(null);
    toast.success('Element removed');
  }, [screens]);

  const handleElementMove = useCallback((screenId: string, elementId: string, position: { x: number; y: number }) => {
    setScreens(screens.map(screen => {
      if (screen.id === screenId) {
        return {
          ...screen,
          elements: screen.elements.map(el => 
            el.id === elementId ? { ...el, position } : el
          )
        };
      }
      return screen;
    }));
  }, [screens]);

  const handleScreenUpdate = useCallback((updatedScreen: FlowScreen) => {
    setScreens(screens.map(s => s.id === updatedScreen.id ? updatedScreen : s));
  }, [screens]);

  const handleElementUpdate = useCallback((updatedElement: FlowElement) => {
    setScreens(screens.map(screen => ({
      ...screen,
      elements: screen.elements.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      )
    })));
  }, [screens]);

  const handleSave = () => {
    // In production, save to your backend
    localStorage.setItem('flow_draft', JSON.stringify({ flowName, screens, selectedClient }));
    toast.success('Flow saved to draft');
  };

  const handleSubmit = async () => {
    if (!selectedClient) {
      toast.error('Please select a client');
      return;
    }

    const client = MOCK_CLIENTS.find(c => c.id === selectedClient);
    if (!client?.has_access_token) {
      toast.error('Client does not have flow access permission');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - replace with your actual Node.js API endpoint
    try {
      // const response = await fetch('/api/flows/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     clientId: selectedClient,
      //     flowName,
      //     flowData
      //   })
      // });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Flow "${flowName}" created successfully for ${client.name}!`, {
        description: 'The flow is now available in WhatsApp Business Manager'
      });
    } catch (error) {
      toast.error('Failed to create flow', {
        description: 'Please check your permissions and try again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentScreen = screens.find(s => s.id === selectedScreen) || null;
  const currentElement = currentScreen?.elements.find(e => e.id === selectedElement) || null;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header
        clients={MOCK_CLIENTS}
        selectedClient={selectedClient}
        onClientChange={setSelectedClient}
        flowName={flowName}
        onFlowNameChange={setFlowName}
        onSave={handleSave}
        onPreview={() => setShowPreview(true)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <div className="flex-1 flex overflow-hidden">
        <ElementPalette onDragStart={setDraggedElementType} />
        
        <FlowCanvas
          screens={screens}
          selectedScreen={selectedScreen}
          selectedElement={selectedElement}
          onScreenSelect={setSelectedScreen}
          onElementSelect={setSelectedElement}
          onAddScreen={handleAddScreen}
          onRemoveScreen={handleRemoveScreen}
          onAddElement={handleAddElement}
          onRemoveElement={handleRemoveElement}
          onElementMove={handleElementMove}
        />

        <PropertiesPanel
          selectedScreen={currentScreen}
          selectedElement={currentElement}
          onScreenUpdate={handleScreenUpdate}
          onElementUpdate={handleElementUpdate}
        />

        <JsonPreview
          flowData={flowData}
          isCollapsed={jsonCollapsed}
          onToggleCollapse={() => setJsonCollapsed(!jsonCollapsed)}
        />
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        flowData={flowData}
      />
    </div>
  );
}
