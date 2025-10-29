import React, { useMemo } from 'react';
import { Incident, Equipment, AppUser, IncidentStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface GroupQueueViewProps {
  incidents: Incident[];
  equipment: Equipment[];
  users: AppUser[];
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

const GroupQueueView: React.FC<GroupQueueViewProps> = ({ incidents, equipment, users }) => {
  // FIX: Destructure user directly from useAuth to ensure correct type inference.
  const { user } = useAuth();
  
  const groupIncidents = useMemo(() => {
    const userGroup = user?.group;
    if (!userGroup) {
      return [];
    }

    const equipmentMap = new Map(equipment.map(e => [e.id, e]));

    return incidents
      .filter(incident => {
        const eq = equipmentMap.get(incident.equipmentId);
        return eq?.group === userGroup;
      })
      .sort((a, b) => {
          const dateA = a.history?.[0]?.timestamp ? new Date(a.history[0].timestamp).getTime() : 0;
          const dateB = b.history?.[0]?.timestamp ? new Date(b.history[0].timestamp).getTime() : 0;
          return dateB - dateA;
      });
  }, [incidents, equipment, user]);

  const getUsernameById = (userId: string) => users.find(u => u.id === userId)?.username || 'Sin asignar';

  if (!user || !user.group) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cola de Grupo</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Usted no está asignado a ningún grupo. Contacte a un administrador.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cola de Grupo: {user.group}</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
        Aquí se muestran todas las incidencias activas para los equipos del grupo {user.group}.
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Incidencia</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Equipo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Técnico Asignado</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {groupIncidents.map(incident => {
              const eq = equipment.find(e => e.id === incident.equipmentId);
              return (
                <tr key={incident.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{incident.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{eq?.model || 'Desconocido'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                        {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{incident.assignedTo ? getUsernameById(incident.assignedTo) : 'Sin asignar'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {groupIncidents.length === 0 && (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                No hay incidencias en la cola de este grupo.
            </div>
        )}
      </div>
    </div>
  );
};

export default GroupQueueView;