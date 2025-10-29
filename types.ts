export enum Role {
  Admin = 'admin',
  User = 'user',
  TSM = 'tsm'
}

export enum Group {
  Software = 'Software',
  Hardware = 'Hardware'
}

export interface AppUser {
  id: string;
  username: string;
  role: Role;
  group?: Group;
}

export type ResponseTime = '1hora' | '2horas' | '4horas' | '8horas' | 'NBD';
export type ResolutionTime = '2horas' | '4horas' | '8horas' | 'NBD';

export interface Equipment {
  id: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  type: 'Portátil' | 'Sobremesa' | 'Monitor' | 'Impresora' | 'Software' | 'Otro';
  purchaseDate: string;
  responseTime: ResponseTime;
  resolutionTime: ResolutionTime;
  group: Group;
}

export enum IncidentStatus {
  Abierta = 'Abierta',
  Asignada = 'Asignada',
  EnProgreso = 'En Progreso',
  TecnicoOnsite = 'Técnico Onsite',
  VisitaConcertada = 'Visita concertada',
  EnEspera = 'En Espera de Piezas',
  PendienteCliente = 'Pendiente de cliente',
  PendienteSDM = 'Pendiente de SDM',
  PendienteTSM = 'Pendiente de TSM',
  Pendiente3ros = 'Pendiente de 3ros',
  Resuelta = 'Resuelta',
  Cerrada = 'Cerrada'
}

export interface IncidentHistoryEntry {
  status: IncidentStatus;
  timestamp: string;
  comment?: string;
}

export interface MaterialUsed {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
}

export interface Incident {
  id: string;
  equipmentId: string;
  title: string;
  description: string;
  status: IncidentStatus;
  history: IncidentHistoryEntry[];
  assignedTo?: string; // userId
  materialsUsed?: MaterialUsed[];
}