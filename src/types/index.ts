export type ServiceType = {
  id: number;
  name: string;
};

export type Currency = 'USD' | 'EUR' | 'ARS';

export type ProjectStatus = 'SENT' | 'ACCEPTED' | 'LOST' | 'PENDING' | 'IN_NEGOTIATION';

export type Country = {
  id: string;
  name: string;
  currency: Currency;
};

export type Client = {
  id: number;
  name: string;
  services: ServiceType[];
  customService?: string;
  needDate: string;
  sentDate: string;
  status: ProjectStatus;
  country: Country;
  currency: Currency;
  oneTimeAmount: number;
  monthlyAmount: number;
  notes: Note[];
};

export type NoteTag = 'MEETING' | 'REMINDER' | 'FOLLOW_UP' | 'NEGOTIATION' | 'GENERAL' | 'IMPORTANT';

export type Note = {
  id: number;
  clientId: number;
  title: string;
  date: string;
  content: string;
  tags: NoteTag[];
};

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'SENT', label: 'Enviada' },
  { value: 'ACCEPTED', label: 'Aceptada' },
  { value: 'LOST', label: 'Perdida' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'IN_NEGOTIATION', label: 'En Negociación' }
];

export const NOTE_TAG_OPTIONS: { value: NoteTag; label: string }[] = [
  { value: 'MEETING', label: 'Reunión' },
  { value: 'REMINDER', label: 'Recordatorio' },
  { value: 'FOLLOW_UP', label: 'Seguimiento' },
  { value: 'NEGOTIATION', label: 'Negociación' },
  { value: 'GENERAL', label: 'General' },
  { value: 'IMPORTANT', label: 'Importante' }
];

export const SERVICES: ServiceType[] = [
  { id: 1, name: 'Diseño Web' },
  { id: 2, name: 'Desarrollo Web' },
  { id: 3, name: 'Marketing Digital' },
  { id: 4, name: 'SEO' },
  { id: 5, name: 'Redes Sociales' },
  { id: 6, name: 'Branding' },
  { id: 7, name: 'Consultoría' },
  { id: 8, name: 'E-commerce' }
];

export const COUNTRIES: Country[] = [
  { id: 'AR', name: 'Argentina', currency: 'ARS' },
  { id: 'US', name: 'Estados Unidos', currency: 'USD' },
  { id: 'ES', name: 'España', currency: 'EUR' },
  { id: 'MX', name: 'México', currency: 'USD' },
  { id: 'CO', name: 'Colombia', currency: 'USD' },
  { id: 'CL', name: 'Chile', currency: 'USD' },
  { id: 'BR', name: 'Brasil', currency: 'USD' },
  { id: 'PE', name: 'Perú', currency: 'USD' },
  { id: 'UY', name: 'Uruguay', currency: 'USD' },
  { id: 'DE', name: 'Alemania', currency: 'EUR' },
  { id: 'FR', name: 'Francia', currency: 'EUR' },
  { id: 'IT', name: 'Italia', currency: 'EUR' },
  { id: 'UK', name: 'Reino Unido', currency: 'EUR' }
];