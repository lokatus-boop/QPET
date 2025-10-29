import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon } from '../icons/Icons';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
        <Bars3Icon className="h-6 w-6" />
      </button>
      <div className="flex items-center">
        {/* Placeholder for search or other header items */}
      </div>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Bienvenido, {user?.username}
        </span>
      </div>
    </header>
  );
};

export default Header;