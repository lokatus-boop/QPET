import React, { useState } from 'react';
import { AppUser, Role } from '../../types';
import Modal from '../shared/Modal';
import UserForm from './UserForm';
import { useAuth } from '../../context/AuthContext';


interface UserManagementViewProps {
  users: AppUser[];
  addUser: (user: Omit<AppUser, 'id'>) => void;
}

const UserManagementView: React.FC<UserManagementViewProps> = ({ users, addUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  if (user?.role !== Role.Admin) {
    return <div className="text-red-500">Acceso denegado.</div>;
  }

  const handleAddUser = (newUser: Omit<AppUser, 'id'>) => {
    addUser(newUser);
    setIsModalOpen(false);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Añadir Usuario
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rol</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grupo</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{u.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{u.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{u.group || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Añadir Nuevo Usuario">
        <UserForm onSubmit={handleAddUser} />
      </Modal>
    </div>
  );
};

export default UserManagementView;