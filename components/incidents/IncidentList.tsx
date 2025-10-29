import React from 'react';
import { Incident, Equipment, IncidentStatus } from '../../types';

interface IncidentListProps {
  incidents: Incident[];
  equipment: Equipment[];
  onSelectIncident: (incident: Incident) => void;
}

const getStatusColor = (status: IncidentStatus) => {
  switch (status) {
    case IncidentStatus.Abierta: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case IncidentStatus.Asignada: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case IncidentStatus.EnProgreso: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case IncidentStatus.TecnicoOnsite: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case IncidentStatus.VisitaConcertada: return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
    case IncidentStatus.EnEspera:
    case IncidentStatus.PendienteCliente:
    case IncidentStatus.PendienteSDM:
    case IncidentStatus.PendienteTSM:
    case IncidentStatus.Pendiente3ros:
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case IncidentStatus.Resuelta: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case IncidentStatus.Cerrada: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const IncidentList: React.FC<IncidentListProps> = ({ incidents, equipment, onSelectIncident }) => {
  const getEquipmentInfo = (equipmentId: string) => {
    const item = equipment.find(e => e.id === equipmentId);
    return item ? `${item.model} (S/N: ${item.serialNumber})` : 'Desconocido';
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {incidents.map(incident => (
        <div 
          key={incident.id} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelectIncident(incident)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white pr-2">{incident.title}</h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
              {incident.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getEquipmentInfo(incident.equipmentId)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">{incident.description}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Abierta: {new Date(incident.history[0].timestamp).toLocaleString()}
          </p>
        </div>
      ))}
      {incidents.length === 0 && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-8 text-gray-500 dark:text-gray-400">
            No hay incidencias registradas.
        </div>
      )}
    </div>
  );
};

export default IncidentList;