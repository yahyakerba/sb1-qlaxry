import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Settings } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <NavLink
              to="/view"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`
              }
            >
              <Users className="w-5 h-5 mr-2" />
              Public View
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`
              }
            >
              <Settings className="w-5 h-5 mr-2" />
              Admin
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}