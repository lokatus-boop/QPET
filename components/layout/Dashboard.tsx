
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Equipment, Incident, AppUser } from '../../types';
import EquipmentView from '../equipment/EquipmentView';
import IncidentsView from '../incidents/IncidentsView';
import UserManagementView from '../users/UserManagementView';
import SlaView from '../sla/SlaView';
import RecurrenceAnalysisView from '../analysis/RecurrenceAnalysisView';
import GroupQueueView from '../group/GroupQueueView';
import Welcome from './Welcome';

type View = 'dashboard' | 'equipment' | 'incidents' | 'users' | 'slas' | 'analysis' | 'groupQueue';

interface DashboardProps {
  users: AppUser[];
  equipment: Equipment[];
  incidents: Incident[];
  addUser: (user: Omit<AppUser, 'id'>) => void;
  addEquipment: (item: Omit<Equipment, 'id'>) => void;
  addIncident: (incident: Omit<Incident, 'id'>) => void;
  updateIncident: (incident: Incident) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ users, equipment, incidents, addUser, addEquipment, addIncident, updateIncident }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Welcome incidentCount={incidents.length} equipmentCount={equipment.length} />;
      case 'equipment':
        return <EquipmentView equipment={equipment} addEquipment={addEquipment} />;
      case 'incidents':
        return <IncidentsView incidents={incidents} equipment={equipment} users={users} addIncident={addIncident} updateIncident={updateIncident} />;
      case 'users':
        return <UserManagementView users={users} addUser={addUser} />;
      case 'slas':
        return <SlaView incidents={incidents} equipment={equipment} />;
      case 'analysis':
        return <RecurrenceAnalysisView incidents={incidents} equipment={equipment} />;
      case 'groupQueue':
        return <GroupQueueView incidents={incidents} equipment={equipment} users={users} />;
      default:
        return <Welcome incidentCount={incidents.length} equipmentCount={equipment.length} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;