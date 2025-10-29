import React, { useState } from 'react';
import { AppUser, Role, Group } from '../../types';

interface UserFormProps {
  onSubmit: (user: Omit<AppUser, 'id'>) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    role: Role.User,
    group: Group.Hardware,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userToSubmit: any = { username: formData.username, role: formData.role };
    if (formData.role === Role.User || formData.role === Role.TSM) {
      userToSubmit.group = formData.group;
    }
    onSubmit(userToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
        <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700">
          <option value={Role.User}>User</option>
          <option value={Role.TSM}>TSM</option>
          <option value={Role.Admin}>Admin</option>
        </select>
      </div>
      {(formData.role === Role.User || formData.role === Role.TSM) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grupo</label>
          <select name="group" value={formData.group} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700">
            <option value={Group.Hardware}>Hardware</option>
            <option value={Group.Software}>Software</option>
          </select>
        </div>
      )}
      <div className="flex justify-end pt-4">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Guardar Usuario</button>
      </div>
    </form>
  );
};

export default UserForm;