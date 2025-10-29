import React, { useMemo } from 'react';
import { Incident, Equipment } from '../../types';

interface RecurrenceAnalysisViewProps {
  incidents: Incident[];
  equipment: Equipment[];
}

interface AnalysisData {
  equipment: Equipment;
  incidentCount: number;
}

const RecurrenceAnalysisView: React.FC<RecurrenceAnalysisViewProps> = ({ incidents, equipment }) => {
  const analysisData = useMemo<AnalysisData[]>(() => {
    const incidentCounts: { [key: string]: number } = {};
    for (const incident of incidents) {
      incidentCounts[incident.equipmentId] = (incidentCounts[incident.equipmentId] || 0) + 1;
    }

    const data: AnalysisData[] = equipment.map(e => ({
      equipment: e,
      incidentCount: incidentCounts[e.id] || 0,
    }));

    // Sort by incident count, descending
    return data.sort((a, b) => b.incidentCount - a.incidentCount);
  }, [incidents, equipment]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Análisis de Incidencias Recurrentes</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
        Esta vista muestra los equipos ordenados por el número total de incidencias registradas, ayudando a identificar los activos más problemáticos.
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Modelo de Equipo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Número de Serie</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">Nº de Incidencias</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {analysisData.map(({ equipment, incidentCount }) => (
              <tr key={equipment.id} className={incidentCount > 1 ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{equipment.model}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{equipment.serialNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 dark:text-gray-100 text-center">{incidentCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {equipment.length === 0 && (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                No hay equipos registrados para analizar.
            </div>
        )}
      </div>
    </div>
  );
};

export default RecurrenceAnalysisView;
