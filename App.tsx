import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/auth/LoginScreen';
import Dashboard from './components/layout/Dashboard';
import { Equipment, Incident, AppUser } from './types';
import { db } from './firebaseConfig';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';

function AppContent() {
  const { user, loading } = useAuth();
  
  const [users, setUsers] = useState<AppUser[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    if (!user) {
      setUsers([]);
      setEquipment([]);
      setIncidents([]);
      return;
    };

    const unsubUsers = onSnapshot(collection(db, 'users'), snapshot => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppUser));
      setUsers(usersData);
    });

    const unsubEquipment = onSnapshot(collection(db, 'equipment'), snapshot => {
      const equipmentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
      setEquipment(equipmentData);
    });

    const incidentsQuery = query(collection(db, 'incidents'), orderBy('history.0.timestamp', 'desc'));
    const unsubIncidents = onSnapshot(incidentsQuery, snapshot => {
      const incidentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));
      setIncidents(incidentsData);
    });

    return () => {
      unsubUsers();
      unsubEquipment();
      unsubIncidents();
    };
  }, [user]);


  const addUser = async (userData: Omit<AppUser, 'id'>) => {
    // Note: User creation should be handled via Firebase Auth and a backend function for security.
    // This is a simplified client-side addition to Firestore.
    await addDoc(collection(db, 'users'), userData);
  };

  const addEquipment = async (item: Omit<Equipment, 'id'>) => {
    await addDoc(collection(db, 'equipment'), item);
  };

  const addIncident = async (incident: Omit<Incident, 'id'>) => {
     await addDoc(collection(db, 'incidents'), incident);
  };
  
  const updateIncident = async (updatedIncident: Incident) => {
    const { id, ...incidentData } = updatedIncident;
    const incidentRef = doc(db, 'incidents', id);
    await updateDoc(incidentRef, incidentData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {user ? (
        <Dashboard 
          users={users}
          equipment={equipment}
          incidents={incidents}
          addUser={addUser}
          addEquipment={addEquipment}
          addIncident={addIncident}
          updateIncident={updateIncident}
        />
      ) : (
        <LoginScreen />
      )}
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App;