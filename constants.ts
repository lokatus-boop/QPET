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
  // FIX: Completed the object definition, closed the array, and updated 'SDH' to 'NBD'.
  { id: 'equip-3', serialNumber: 'SN-C789', model: 'OptiPlex 5090', manufacturer: 'Dell', type: 'Sobremesa', purchaseDate: '2022-11-05', responseTime: '8horas', resolutionTime: 'NBD', group: Group.Hardware },
];
