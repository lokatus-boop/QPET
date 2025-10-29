
import React, { useState } from 'react';
import { Equipment, Incident, IncidentStatus } from '../../types';

interface IncidentFormProps {
  equipment: Equipment[];
  onSubmit: (incident: Omit<Incident, 'id'>) => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ equipment, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    equipmentId: equipment[0]?.id || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipmentId) {
      alert("Por favor, seleccione un equipo.");
      return;
    }
    const newIncident: Omit<Incident, 'id'> = {
      ...formData,
      status: IncidentStatus.Abierta,
      history: [{ status: IncidentStatus.Abierta, timestamp: new Date().toISOString() }],
    };
    onSubmit(newIncident);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Equipo Afectado</label>
        <select name="equipmentId" value={formData.equipmentId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700">
          {equipment.map(item => (
            <option key={item.id} value={item.id}>
              {item.model} (S/N: {item.serialNumber})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700" />
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Crear Incidencia</button>
      </div>
    </form>
  );
};

export default IncidentForm;
