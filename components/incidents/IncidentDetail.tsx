import React, { useState, useMemo } from 'react';
import { Incident, IncidentStatus, AppUser, Role, MaterialUsed, Equipment } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface IncidentDetailProps {
  incident: Incident;
  users: AppUser[];
  equipment: Equipment[];
  onUpdate: (incident: Incident) => void;
}

const IncidentDetail: React.FC<IncidentDetailProps> = ({ incident, users, equipment, onUpdate }) => {
  const { user } = useAuth();

  // Form states
  const [newStatus, setNewStatus] = useState<IncidentStatus>(incident.status);
  const [assignedTo, setAssignedTo] = useState<string>(incident.assignedTo || '');
  const [comment, setComment] = useState<string>('');
  
  // Materials state
  const [materials, setMaterials] = useState<MaterialUsed[]>(incident.materialsUsed || []);
  const [newMaterial, setNewMaterial] = useState({ name: '', partNumber: '', quantity: '1' });

  const currentUserDetails = user;
  const incidentEquipment = useMemo(() => equipment.find(e => e.id === incident.equipmentId), [incident, equipment]);
  const incidentGroup = incidentEquipment?.group;

  const canReassign = useMemo(() => {
    if (!user) return false;
    if (user.role === Role.Admin) return true;
    if (user.role === Role.TSM && currentUserDetails?.group === incidentGroup) return true;
    return false;
  }, [user, currentUserDetails, incidentGroup]);

  const availableTechnicians = useMemo(() => {
    return users.filter(u => {
      if (u.role !== Role.User) return false;
      if (user?.role === Role.Admin) return true;
      if (user?.role === Role.TSM) return u.group === currentUserDetails?.group;
      return false;
    });
  }, [users, user, currentUserDetails]);


  const handleAddMaterial = () => {
    if (!newMaterial.name.trim() || !newMaterial.partNumber.trim() || parseInt(newMaterial.quantity) < 1) {
        alert('Por favor, complete todos los campos del material.');
        return;
    }
    setMaterials(prev => [...prev, { ...newMaterial, quantity: parseInt(newMaterial.quantity), id: `mat-${Date.now()}` }]);
    setNewMaterial({ name: '', partNumber: '', quantity: '1' });
  };
  
  const handleRemoveMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdate = () => {
    if (newStatus !== incident.status && !comment.trim()) {
      alert('Por favor, añada un comentario para justificar el cambio de estado.');
      return;
    }

    const statusChanged = newStatus !== incident.status;
    const assignmentChanged = canReassign && assignedTo !== (incident.assignedTo || '');
    const commentAdded = comment.trim() !== '';
    const materialsChanged = JSON.stringify(materials) !== JSON.stringify(incident.materialsUsed || []);

    if (!statusChanged && !assignmentChanged && !commentAdded && !materialsChanged) {
        return; // Nothing to update
    }

    const newHistory = [...incident.history];
    if (statusChanged || commentAdded) {
        newHistory.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            comment: comment.trim() || (statusChanged ? `Estado cambiado a ${newStatus}`: 'Actualización de la incidencia.'),
        });
    }

    const updatedIncident = {
      ...incident,
      status: newStatus,
      assignedTo: assignedTo || incident.assignedTo,
      history: newHistory,
      materialsUsed: materials,
    };
    onUpdate(updatedIncident);
    setComment('');
  };
  
  const availableStatuses = Object.values(IncidentStatus);

  return (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Descripción</h4>
        <p className="text-gray-600 dark:text-gray-400">{incident.description}</p>
      </div>

       <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Materiales Utilizados</h4>
        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto pr-2">
            {materials.length > 0 ? materials.map(m => (
                <div key={m.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{m.name} (x{m.quantity})</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">P/N: {m.partNumber}</p>
                    </div>
                    {user && <button onClick={() => handleRemoveMaterial(m.id)} className="text-red-500 hover:text-red-700 text-xs">Quitar</button>}
                </div>
            )) : <p className="text-gray-500 dark:text-gray-400 text-xs italic">No se han registrado materiales.</p>}
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Historial de Estados</h4>
        <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400 max-h-48 overflow-y-auto pr-2">
           {incident.history.map((entry, index) => (
            <li key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800 dark:text-gray-200">{entry.status}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
              {entry.comment && <p className="mt-1.5 text-gray-600 dark:text-gray-300 whitespace-pre-wrap text-xs">{entry.comment}</p>}
            </li>
          ))}
        </ul>
      </div>

      {user && (
        <div className="border-t dark:border-gray-700 pt-4 space-y-4">
            {/* Add Material Form */}
            <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Añadir Material</label>
                 <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
                    <input type="text" placeholder="Nombre" value={newMaterial.name} onChange={e => setNewMaterial({...newMaterial, name: e.target.value})} className="col-span-6 sm:col-span-2 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-sm bg-white dark:bg-gray-700" />
                    <input type="text" placeholder="Nº de Pieza" value={newMaterial.partNumber} onChange={e => setNewMaterial({...newMaterial, partNumber: e.target.value})} className="col-span-4 sm:col-span-2 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-sm bg-white dark:bg-gray-700" />
                    <input type="number" placeholder="Cant." value={newMaterial.quantity} min="1" onChange={e => setNewMaterial({...newMaterial, quantity: e.target.value})} className="col-span-2 sm:col-span-1 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-sm bg-white dark:bg-gray-700" />
                    <button onClick={handleAddMaterial} className="col-span-6 sm:col-span-1 mt-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Añadir</button>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asignar a Técnico</label>
                  <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} disabled={!canReassign} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm sm:text-sm bg-white dark:bg-gray-700 disabled:bg-gray-200 dark:disabled:bg-gray-600">
                    <option value="">Sin asignar</option>
                    {availableTechnicians.map(tech => <option key={tech.id} value={tech.id}>{tech.username}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cambiar Estado</label>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value as IncidentStatus)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm sm:text-sm bg-white dark:bg-gray-700">
                    {availableStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
            </div>
          <div>
             <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Añadir Intervención / Comentario
                {newStatus !== incident.status && <span className="text-red-500 ml-1">(comentario obligatorio por cambio de estado)</span>}
            </label>
            <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm sm:text-sm bg-white dark:bg-gray-700" placeholder="Detalle las acciones realizadas..." />
          </div>
          <div className="flex justify-end">
            <button onClick={handleUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Actualizar Incidencia</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDetail;