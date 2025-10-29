import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import LoginScreen from './components/auth/LoginScreen';
import Dashboard from './components/layout/Dashboard';
import { Equipment, Incident, AppUser } from './types';
import { auth, db } from './firebaseConfig';

function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<AppUser[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
        if (userDoc.exists) {
          setCurrentUser({ id: userDoc.id, ...userDoc.data() } as AppUser);
        } else {
          setCurrentUser(null); // Or handle user not in DB case
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setUsers([]);
      setEquipment([]);
      setIncidents([]);
      return;
    };

    const unsubUsers = db.collection('users').onSnapshot(snapshot => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppUser));
      setUsers(usersData);
    });

    const unsubEquipment = db.collection('equipment').onSnapshot(snapshot => {
      const equipmentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
      setEquipment(equipmentData);
    });

    const unsubIncidents = db.collection('incidents').orderBy('history.0.timestamp', 'desc').onSnapshot(snapshot => {
      const incidentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));
      setIncidents(incidentsData);
    });

    return () => {
      unsubUsers();
      unsubEquipment();
      unsubIncidents();
    };
  }, [currentUser]);


  const addUser = async (user: Omit<AppUser, 'id'>) => {
    // Note: User creation should be handled via Firebase Auth and a backend function for security.
    // This is a simplified client-side addition to Firestore.
    await db.collection('users').add(user);
  };

  const addEquipment = async (item: Omit<Equipment, 'id'>) => {
    await db.collection('equipment').add(item);
  };

  const addIncident = async (incident: Omit<Incident, 'id'>) => {
     await db.collection('incidents').add(incident);
  };
  
  const updateIncident = async (updatedIncident: Incident) => {
    const { id, ...incidentData } = updatedIncident;
    await db.collection('incidents').doc(id).update(incidentData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {currentUser ? (
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
    </AuthProvider>
  );
}

export default App;