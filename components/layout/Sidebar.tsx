import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { HomeIcon, ComputerDesktopIcon, ExclamationTriangleIcon, UsersIcon, ClockIcon, ArrowLeftOnRectangleIcon, ChartBarIcon, ClipboardDocumentListIcon, LogoIcon } from '../icons/Icons';


interface SidebarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isSidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', view: 'dashboard', icon: HomeIcon, role: [Role.Admin, Role.User, Role.TSM] },
    { name: 'Equipos', view: 'equipment', icon: ComputerDesktopIcon, role: [Role.Admin, Role.User, Role.TSM] },
    { name: 'Incidencias', view: 'incidents', icon: ExclamationTriangleIcon, role: [Role.Admin, Role.User, Role.TSM] },
    { name: 'Cola de Grupo', view: 'groupQueue', icon: ClipboardDocumentListIcon, role: [Role.User] },
    { name: 'SLAs', view: 'slas', icon: ClockIcon, role: [Role.Admin, Role.User, Role.TSM] },
    { name: 'Análisis', view: 'analysis', icon: ChartBarIcon, role: [Role.Admin, Role.TSM] },
    { name: 'Usuarios', view: 'users', icon: UsersIcon, role: [Role.Admin] },
  ];

  return (
    <>
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col`}>
        <div className="flex items-center justify-center h-20 px-4 border-b dark:border-gray-700">
          <LogoIcon className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">QPET Manager</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            user && item.role.includes(user.role) && (
              <a
                key={item.name}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView(item.view);
                  setSidebarOpen(false);
                }}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  currentView === item.view
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            )
          ))}
        </nav>
        <div className="px-4 py-4 border-t dark:border-gray-700">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;