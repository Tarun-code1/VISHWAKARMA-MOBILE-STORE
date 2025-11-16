
import React from 'react';
import { CollectionIcon, ChartBarIcon, BookOpenIcon, SettingsIcon, UserCircleIcon } from './icons';
import { AppSettings } from '../types';

type View = 'stock' | 'dashboard' | 'khata' | 'settings';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  settings: AppSettings;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, settings }) => {
  const NavButton: React.FC<{
    view: View;
    label: string;
    icon: React.ReactNode;
  }> = ({ view, label, icon }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setCurrentView(view)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-indigo-700">
            Vishwakarma <span className="text-gray-800">Store</span>
          </h1>
          <div className="flex items-center space-x-4">
            <nav className="bg-gray-100 p-1 rounded-lg flex space-x-1">
              <NavButton view="stock" label="Stock" icon={<CollectionIcon className="h-5 w-5" />} />
              <NavButton view="dashboard" label="Dashboard" icon={<ChartBarIcon className="h-5 w-5" />} />
              <NavButton view="khata" label="Khata" icon={<BookOpenIcon className="h-5 w-5" />} />
              <NavButton view="settings" label="Settings" icon={<SettingsIcon className="h-5 w-5" />} />
            </nav>
            <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{settings.ownerName}</span>
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-indigo-200">
                    {settings.ownerPhoto ? (
                        <img src={settings.ownerPhoto} alt="Owner" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircleIcon className="w-full h-full text-gray-400" />
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;