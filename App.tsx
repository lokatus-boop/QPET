import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import LoginScreen from './components/auth/LoginScreen';
import Dashboard from './components/layout/Dashboard';
import { Equipment, Incident, AppUser } from './types';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, query, orderBy, addDoc, updateDoc } from 'firebase/firestore';

function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<AppUser[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUser({ id: userDocSnap.id, ...userDocSnap.data() } as AppUser);
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
  }, [currentUser]);


  const addUser = async (user: Omit<AppUser, 'id'>) => {
    // Note: User creation should be handled via Firebase Auth and a backend function for security.
    // This is a simplified client-side addition to Firestore.
    await addDoc(collection(db, 'users'), user);
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