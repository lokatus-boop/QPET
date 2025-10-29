
import React from 'react';
import { ComputerDesktopIcon, ExclamationTriangleIcon } from '../icons/Icons';

interface WelcomeProps {
    incidentCount: number;
    equipmentCount: number;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
    <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full">
      <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const Welcome: React.FC<WelcomeProps> = ({ incidentCount, equipmentCount }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Incidencias Activas" value={incidentCount} icon={ExclamationTriangleIcon} />
        <StatCard title="Equipos Gestionados" value={equipmentCount} icon={ComputerDesktopIcon} />
      </div>
    </div>
  );
};

export default Welcome;
