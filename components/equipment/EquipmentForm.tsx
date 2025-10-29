import React, { useState } from 'react';
import { Equipment, ResponseTime, ResolutionTime, Group } from '../../types';

interface EquipmentFormProps {
  onSubmit: (item: Omit<Equipment, 'id'>) => void;
  initialData?: Equipment;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    serialNumber: initialData?.serialNumber || '',
    model: initialData?.model || '',
    manufacturer: initialData?.manufacturer || '',
    type: initialData?.type || 'Portátil',
    purchaseDate: initialData?.purchaseDate || '',
    responseTime: initialData?.responseTime || '8horas',
    resolutionTime: initialData?.resolutionTime || 'NBD',
    group: initialData?.group || Group.Hardware,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Equipment, 'id'>);
  };

  const responseTimeOptions: ResponseTime[] = ['1hora', '2horas', '4horas', '8horas', 'NBD'];
  const resolutionTimeOptions: ResolutionTime[] = ['2horas', '4horas', '8horas', 'NBD'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Serie</label>
        <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Modelo</label>
        <input type="text" name="model" value={formData.model} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700" />
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fabricante</label>
        <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700" />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grupo</label>
            <select name="group" value={formData.group} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700">
              <option value={Group.Hardware}>Hardware</option>
              <option value={Group.Software}>Software</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
            <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700">
              <option>Portátil</option>
              <option>Sobremesa</option>
              <option>Monitor</option>
              <option>Impresora</option>
              <option>Software</option>
              <option>Otro</option>
            </select>
          </div>
       </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tiempo de Respuesta (SLA)</label>
            <select name="responseTime" value={formData.responseTime} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700">
            {responseTimeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tiempo de Resolución (SLA)</label>
            <select name="resolutionTime" value={formData.resolutionTime} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700">
            {resolutionTimeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Compra</label>
        <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700" />
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Guardar Equipo</button>
      </div>
    </form>
  );
};

export default EquipmentForm;