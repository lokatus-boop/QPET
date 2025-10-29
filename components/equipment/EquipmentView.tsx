import React, { useState } from 'react';
import { Equipment } from '../../types';
import EquipmentList from './EquipmentList';
import EquipmentForm from './EquipmentForm';
import Modal from '../shared/Modal';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

interface EquipmentViewProps {
  equipment: Equipment[];
  addEquipment: (item: Omit<Equipment, 'id'>) => void;
}

const EquipmentView: React.FC<EquipmentViewProps> = ({ equipment, addEquipment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleAddEquipment = (item: Omit<Equipment, 'id'>) => {
    addEquipment(item);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Equipos</h1>
        {user?.role === Role.Admin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Añadir Equipo
          </button>
        )}
      </div>
      
      <EquipmentList equipment={equipment} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Añadir Nuevo Equipo">
        <EquipmentForm onSubmit={handleAddEquipment} />
      </Modal>
    </div>
  );
};

export default EquipmentView;