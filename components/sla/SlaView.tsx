import React from 'react';
import { Incident, Equipment, IncidentStatus, ResolutionTime, ResponseTime } from '../../types';

// --- Constants ---
const PAUSED_STATUSES = [
  IncidentStatus.EnEspera,
  IncidentStatus.PendienteCliente,
  IncidentStatus.PendienteSDM,
  IncidentStatus.PendienteTSM,
  IncidentStatus.Pendiente3ros,
];

const ACTIVE_RESPONSE_STATUSES = [
  IncidentStatus.EnProgreso,
  IncidentStatus.TecnicoOnsite,
  IncidentStatus.VisitaConcertada,
  IncidentStatus.Resuelta,
  IncidentStatus.Cerrada
];

// --- Helper Functions ---
const formatDuration = (ms: number) => {
  if (ms < 0) return 'N/A';
  if (ms === 0) return '0s';
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);
  
  return parts.join(' ');
};

const calculateBusinessHoursDuration = (startDate: Date, endDate: Date): number => {
    const businessStartHour = 8;
    const businessEndHour = 18;
    let totalBusinessMillis = 0;

    let current = new Date(startDate);
    const finalEndDate = new Date(endDate);

    if (finalEndDate <= current) {
        return 0;
    }

    while (current < finalEndDate) {
        const dayOfWeek = current.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        if (!isWeekend) {
            const businessDayStart = new Date(current);
            businessDayStart.setHours(businessStartHour, 0, 0, 0);

            const businessDayEnd = new Date(current);
            businessDayEnd.setHours(businessEndHour, 0, 0, 0);

            const effectiveStart = Math.max(current.getTime(), businessDayStart.getTime());
            const effectiveEnd = Math.min(finalEndDate.getTime(), businessDayEnd.getTime());

            if (effectiveEnd > effectiveStart) {
                totalBusinessMillis += effectiveEnd - effectiveStart;
            }
        }
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
    }
    return totalBusinessMillis;
};

const timeStringToMs = (timeString: ResponseTime | ResolutionTime): number => {
    const hour = 60 * 60 * 1000;
    switch(timeString) {
        case '1hora': return 1 * hour;
        case '2horas': return 2 * hour;
        case '4horas': return 4 * hour;
        case '8horas': return 8 * hour;
        case 'NBD': return 10 * hour; // Asumiendo jornada laboral de 10h
        default: return Infinity;
    }
};

// --- Sub-components ---
interface SlaMetricProps {
    title: string;
    target: string;
    actualMs: number;
    status: 'Cumplido' | 'Incumplido' | 'Pendiente';
}

const SlaMetric: React.FC<SlaMetricProps> = ({ title, target, actualMs, status }) => {
    const statusColors = {
        Cumplido: 'text-green-600 dark:text-green-400',
        Incumplido: 'text-red-600 dark:text-red-400',
        Pendiente: 'text-yellow-600 dark:text-yellow-400',
    };
    return (
        <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatDuration(actualMs)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">Objetivo: {target}</p>
            <p className={`mt-1 text-sm font-bold ${statusColors[status]}`}>{status}</p>
        </div>
    );
};

// --- Main Component ---
const SlaView: React.FC<{ incidents: Incident[]; equipment: Equipment[] }> = ({ incidents, equipment }) => {
    
  const incidentSlaData = incidents.map(incident => {
    const associatedEquipment = equipment.find(e => e.id === incident.equipmentId);
    if (!associatedEquipment) return null;

    const history = incident.history;
    if (history.length < 1) return null;

    // --- Response Time Calculation ---
    let actualResponseMs = -1;
    const firstResponseEntry = history.find(entry => ACTIVE_RESPONSE_STATUSES.includes(entry.status));
    if (firstResponseEntry) {
      let responseDuration = 0;
      const responseHistorySlice = history.slice(0, history.indexOf(firstResponseEntry) + 1);
      for (let i = 1; i < responseHistorySlice.length; i++) {
        const prev = responseHistorySlice[i - 1];
        if (!PAUSED_STATUSES.includes(prev.status)) {
          responseDuration += calculateBusinessHoursDuration(new Date(prev.timestamp), new Date(responseHistorySlice[i].timestamp));
        }
      }
      actualResponseMs = responseDuration;
    }

    // --- Resolution Time Calculation ---
    let actualResolutionMs = -1;
    const resolutionEntry = history.find(entry => entry.status === IncidentStatus.Resuelta);
    if (resolutionEntry) {
        let resolutionDuration = 0;
        const resolutionHistorySlice = history.slice(0, history.indexOf(resolutionEntry) + 1);
        for (let i = 1; i < resolutionHistorySlice.length; i++) {
            const prev = resolutionHistorySlice[i-1];
            if (!PAUSED_STATUSES.includes(prev.status)) {
                resolutionDuration += calculateBusinessHoursDuration(new Date(prev.timestamp), new Date(resolutionHistorySlice[i].timestamp));
            }
        }
        actualResolutionMs = resolutionDuration;
    }

    const targetResponseMs = timeStringToMs(associatedEquipment.responseTime);
    const targetResolutionMs = timeStringToMs(associatedEquipment.resolutionTime);

    const responseStatus = actualResponseMs === -1 ? 'Pendiente' : (actualResponseMs <= targetResponseMs ? 'Cumplido' : 'Incumplido');
    const resolutionStatus = actualResolutionMs === -1 ? 'Pendiente' : (actualResolutionMs <= targetResolutionMs ? 'Cumplido' : 'Incumplido');

    return {
        incident,
        equipment: associatedEquipment,
        metrics: {
            response: { target: associatedEquipment.responseTime, actualMs: actualResponseMs, status: responseStatus },
            resolution: { target: associatedEquipment.resolutionTime, actualMs: actualResolutionMs, status: resolutionStatus },
        }
    };
  }).filter(Boolean);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Métricas de SLA</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Cálculo en horario laboral (L-V, 8:00-18:00). El tiempo se pausa en estados "Pendientes".</p>
      <div className="space-y-6">
        {incidentSlaData.map(data => (
          <div key={data.incident.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{data.incident.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{data.equipment.model} (S/N: {data.equipment.serialNumber})</p>
            <div className="flex flex-col md:flex-row gap-4">
                <SlaMetric title="Tiempo de Respuesta" {...data.metrics.response} />
                <SlaMetric title="Tiempo de Resolución" {...data.metrics.resolution} />
            </div>
          </div>
        ))}
         {incidents.length === 0 && (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow">
                No hay incidencias para calcular SLAs.
            </div>
        )}
      </div>
    </div>
  );
};

export default SlaView;