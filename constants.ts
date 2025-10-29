import { AppUser, Role, Equipment, Incident, IncidentStatus, Group } from './types';

export const mockUsers: AppUser[] = [
  { id: 'user-1', username: 'admin', role: Role.Admin },
  { id: 'user-2', username: 'tecnico1', role: Role.User, group: Group.Software },
  { id: 'user-3', username: 'tecnico2', role: Role.User, group: Group.Hardware },
  { id: 'user-4', username: 'TSMSoft', role: Role.TSM, group: Group.Software },
  { id: 'user-5', username: 'TSMHard', role: Role.TSM, group: Group.Hardware },
];

export const mockEquipment: Equipment[] = [
  { id: 'equip-1', serialNumber: 'SN-A123', model: 'Latitude 7420', manufacturer: 'Dell', type: 'Portátil', purchaseDate: '2023-01-15', responseTime: '4horas', resolutionTime: '8horas', group: Group.Hardware },
  { id: 'equip-2', serialNumber: 'SN-B456', model: 'ThinkPad X1', manufacturer: 'Lenovo', type: 'Portátil', purchaseDate: '2023-02-20', responseTime: '2horas', resolutionTime: '4horas', group: Group.Hardware },
  { id: 'equip-3', serialNumber: 'SN-C789', model: 'OptiPlex 5090', manufacturer: 'Dell', type: 'Sobremesa', purchaseDate: '2022-11-05', responseTime: '8horas', resolutionTime: 'NBD', group: Group.Hardware },
  { id: 'equip-4', serialNumber: 'SN-D101', model: 'UltraSharp U2721DE', manufacturer: 'Dell', type: 'Monitor', purchaseDate: '2023-01-15', responseTime: 'NBD', resolutionTime: 'NBD', group: Group.Hardware },
  { id: 'equip-5', serialNumber: 'SUB-IBM-WTSN-01', model: 'IBM Watson Studio', manufacturer: 'IBM', type: 'Software', purchaseDate: '2023-03-01', responseTime: '1hora', resolutionTime: '4horas', group: Group.Software },
];

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
const threeDaysAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);

export const mockIncidents: Incident[] = [
  { 
    id: 'inc-1', 
    equipmentId: 'equip-1', 
    title: 'El portátil no enciende', 
    description: 'El usuario reporta que el equipo no da señales de vida al presionar el botón de encendido.',
    status: IncidentStatus.EnProgreso,
    assignedTo: 'user-3',
    history: [
      { status: IncidentStatus.Abierta, timestamp: threeDaysAgo.toISOString(), comment: 'Incidencia creada automáticamente.' },
      { status: IncidentStatus.Asignada, timestamp: twoDaysAgo.toISOString(), comment: 'Asignado a tecnico2.' },
      { status: IncidentStatus.EnProgreso, timestamp: yesterday.toISOString(), comment: 'Se inicia revisión del equipo. Posible fallo de alimentación.' },
    ],
    materialsUsed: [
      { id: 'mat-1', name: 'Fuente de Alimentación 500W', partNumber: 'PSU-DELL-500XYZ', quantity: 1 }
    ]
  },
  { 
    id: 'inc-2', 
    equipmentId: 'equip-3', 
    title: 'Problemas de red', 
    description: 'El equipo de sobremesa no se conecta a la red cableada.',
    status: IncidentStatus.Resuelta,
    assignedTo: 'user-3',
    history: [
      { status: IncidentStatus.Abierta, timestamp: twoDaysAgo.toISOString(), comment: 'Usuario reporta fallo de conexión.' },
      { status: IncidentStatus.Asignada, timestamp: twoDaysAgo.toISOString(), comment: 'Asignado a tecnico2.' },
      { status: IncidentStatus.EnProgreso, timestamp: yesterday.toISOString(), comment: 'Se comprueba el cable de red y la configuración de IP. Todo parece correcto.' },
      { status: IncidentStatus.Resuelta, timestamp: now.toISOString(), comment: 'El problema era un puerto defectuoso en el switch. Se ha cambiado al equipo a otro puerto y funciona correctamente.' },
    ]
  },
   { 
    id: 'inc-3', 
    equipmentId: 'equip-5', 
    title: 'Error de licencia en Watson', 
    description: 'El sistema indica que la licencia ha expirado pero fue renovada la semana pasada.',
    status: IncidentStatus.Asignada,
    assignedTo: 'user-2',
    history: [
      { status: IncidentStatus.Abierta, timestamp: now.toISOString(), comment: 'Incidencia creada por el usuario.' },
      { status: IncidentStatus.Asignada, timestamp: now.toISOString(), comment: 'Asignado a tecnico1.' },
    ]
  },
  { 
    id: 'inc-4', 
    equipmentId: 'equip-1', 
    title: 'Batería no carga', 
    description: 'La batería del portátil Latitude 7420 no retiene la carga y se apaga al desconectar el cargador.',
    status: IncidentStatus.Asignada,
    assignedTo: 'user-3',
    history: [
      { status: IncidentStatus.Abierta, timestamp: yesterday.toISOString(), comment: 'Reportado por el departamento de marketing.' },
       { status: IncidentStatus.Asignada, timestamp: now.toISOString(), comment: 'Asignado a tecnico2 para diagnóstico.' },
    ]
  },
];