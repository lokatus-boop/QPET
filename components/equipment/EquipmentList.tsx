import React from 'react';
import { Equipment } from '../../types';

interface EquipmentListProps {
  equipment: Equipment[];
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipment }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">N/S</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Modelo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grupo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">T. Respuesta</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">T. Resolución</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha Compra</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {equipment.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.serialNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.model}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.group}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.responseTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.resolutionTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(item.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 font-bold text-gray-500 dark:text-gray-300">Equipos</div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {equipment.map(item => (
            <li key={item.id} className="p-4">
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-900 dark:text-white">{item.model}</p>
                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.group === 'Hardware' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  {item.group}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                <p><span className="font-semibold">N/S:</span> {item.serialNumber}</p>
                 <p><span className="font-semibold">Tipo:</span> {item.type}</p>
                <p><span className="font-semibold">T. Resp:</span> {item.responseTime}</p>
                <p><span className="font-semibold">T. Resol:</span> {item.resolutionTime}</p>
                <p><span className="font-semibold">Compra:</span> {new Date(item.purchaseDate).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

       {equipment.length === 0 && (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            No hay equipos registrados.
        </div>
      )}
    </div>
  );
};

export default EquipmentList;