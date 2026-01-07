export type FlowElementType = 
  | 'text'
  | 'text-heading'
  | 'text-subheading'
  | 'text-body'
  | 'text-caption'
  | 'image'
  | 'image-picker'
  | 'document-picker'
  | 'footer'
  | 'opt-in'
  | 'text-input'
  | 'text-area'
  | 'checkbox-group'
  | 'radio-buttons'
  | 'dropdown'
  | 'date-picker'
  | 'calendar-picker'
  | 'embedded-link'
  | 'navigation-list';

export interface FlowElement {
  id: string;
  type: FlowElementType;
  name: string;
  properties: Record<string, any>;
  position: { x: number; y: number };
}

export interface FlowScreen {
  id: string;
  title: string;
  elements: FlowElement[];
  terminal?: boolean;
}

export interface FlowData {
  version: string;
  screens: FlowScreen[];
}

export interface Client {
  id: string;
  name: string;
  phone_number_id: string;
  waba_id: string;
  has_access_token: boolean;
}

export interface ElementCategory {
  name: string;
  elements: {
    type: FlowElementType;
    label: string;
    icon: string;
    description: string;
  }[];
}

export const ELEMENT_CATEGORIES: ElementCategory[] = [
  {
    name: 'Text',
    elements: [
      { type: 'text-heading', label: 'Heading', icon: 'Type', description: 'Large heading text' },
      { type: 'text-subheading', label: 'Subheading', icon: 'Type', description: 'Medium subheading' },
      { type: 'text-body', label: 'Body', icon: 'AlignLeft', description: 'Body paragraph text' },
      { type: 'text-caption', label: 'Caption', icon: 'TextCursor', description: 'Small caption text' },
    ]
  },
  {
    name: 'Media',
    elements: [
      { type: 'image', label: 'Image', icon: 'Image', description: 'Display an image' },
      { type: 'image-picker', label: 'Image Picker', icon: 'ImagePlus', description: 'Upload image' },
      { type: 'document-picker', label: 'Document Picker', icon: 'FileUp', description: 'Upload document' },
      { type: 'embedded-link', label: 'Embedded Link', icon: 'Link', description: 'Clickable link' },
    ]
  },
  {
    name: 'Input',
    elements: [
      { type: 'text-input', label: 'Text Input', icon: 'TextCursorInput', description: 'Single line input' },
      { type: 'text-area', label: 'Text Area', icon: 'FileText', description: 'Multi-line input' },
      { type: 'dropdown', label: 'Dropdown', icon: 'ChevronDown', description: 'Select dropdown' },
      { type: 'date-picker', label: 'Date Picker', icon: 'Calendar', description: 'Date selection' },
      { type: 'calendar-picker', label: 'Calendar Picker', icon: 'CalendarRange', description: 'Date range selection' },
    ]
  },
  {
    name: 'Selection',
    elements: [
      { type: 'checkbox-group', label: 'Checkbox Group', icon: 'CheckSquare', description: 'Multiple selection' },
      { type: 'radio-buttons', label: 'Radio Buttons', icon: 'Circle', description: 'Single selection' },
      { type: 'opt-in', label: 'Opt-in', icon: 'ToggleRight', description: 'Consent checkbox' },
    ]
  },
  {
    name: 'Navigation',
    elements: [
      { type: 'footer', label: 'Footer', icon: 'ArrowRight', description: 'Action footer button' },
      { type: 'navigation-list', label: 'Navigation List', icon: 'List', description: 'List with navigation' },
    ]
  }
];
