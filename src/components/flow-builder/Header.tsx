import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Save, Play, Upload, ChevronDown, Zap } from 'lucide-react';
import { Client } from '@/types/flow';

interface HeaderProps {
  clients: Client[];
  selectedClient: string | null;
  onClientChange: (clientId: string) => void;
  flowName: string;
  onFlowNameChange: (name: string) => void;
  onSave: () => void;
  onPreview: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function Header({
  clients,
  selectedClient,
  onClientChange,
  flowName,
  onFlowNameChange,
  onSave,
  onPreview,
  onSubmit,
  isSubmitting
}: HeaderProps) {
  const selectedClientData = clients.find(c => c.id === selectedClient);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Flow Builder</h1>
            <p className="text-xs text-muted-foreground">WhatsApp Business</p>
          </div>
        </div>

        <div className="h-8 w-px bg-border mx-2" />

        <input
          type="text"
          value={flowName}
          onChange={(e) => onFlowNameChange(e.target.value)}
          className="bg-transparent border-none text-foreground font-medium focus:outline-none focus:ring-0 px-2 py-1 rounded hover:bg-secondary/50 transition-colors"
          placeholder="Untitled Flow"
        />

        <Badge variant="outline" className="text-xs text-muted-foreground">
          Draft
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Client:</span>
          <Select value={selectedClient || ''} onValueChange={onClientChange}>
            <SelectTrigger className="w-[200px] bg-secondary border-border">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  <div className="flex items-center gap-2">
                    <span>{client.name}</span>
                    {client.has_access_token && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-success/10 text-success">
                        Connected
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onPreview}>
            <Play className="w-4 h-4 mr-2" />
            Preview
          </Button>

          <Button 
            size="sm" 
            onClick={onSubmit}
            disabled={!selectedClient || isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Creating...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Create Flow
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
