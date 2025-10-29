import React, { useState } from 'react';
import { Incident, Equipment, AppUser } from '../../types';
import IncidentList from './IncidentList';
import IncidentForm from './IncidentForm';
import IncidentDetail from './IncidentDetail';
import Modal from '../shared/Modal';

interface IncidentsViewProps {
  incidents: Incident[];
  equipment: Equipment[];
  users: AppUser[];
  addIncident: (incident: Omit<Incident, 'id'>) => void;
  updateIncident: (incident: Incident) => void;
}

const IncidentsView: React.FC<IncidentsViewProps> = ({ incidents, equipment, users, addIncident, updateIncident }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const handleAddIncident = (incident: Omit<Incident, 'id'>) => {
    addIncident(incident);
    setIsFormModalOpen(false);
  };

  const handleUpdateIncident = (incident: Incident) => {
    updateIncident(incident);
    setSelectedIncident(incident);
  };
  
  const handleCloseDetail = () => {
    setSelectedIncident(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Incidencias</h1>
        <button
          onClick={() => setIsFormModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Abrir Incidencia
        </button>
      </div>
      
      <IncidentList incidents={incidents} equipment={equipment} onSelectIncident={setSelectedIncident} />

      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Abrir Nueva Incidencia">
        <IncidentForm equipment={equipment} onSubmit={handleAddIncident} />
      </Modal>

      <Modal isOpen={!!selectedIncident} onClose={handleCloseDetail} title={`Detalle Incidencia: ${selectedIncident?.title || ''}`}>
        {selectedIncident && <IncidentDetail incident={selectedIncident} users={users} equipment={equipment} onUpdate={handleUpdateIncident} />}
      </Modal>
    </div>
  );
};

export default IncidentsView;