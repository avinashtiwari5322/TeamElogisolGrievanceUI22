import React from 'react';
import { 
  Home, 
  FileText, 
  Mail, 
  Users, 
  Settings, 
  BarChart3, 
  Plus,
  Filter,
  Archive,
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.userType === 'Admin';

  const customerMenuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'my-requests', icon: FileText, label: 'My Requests' },
    { id: 'create-request', icon: Plus, label: 'New Request' },
  ];

  const adminMenuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'all-requests', icon: FileText, label: 'All Requests' },
    { id: 'pending', icon: Filter, label: 'Pending' },
    { id: 'active', icon: Star, label: 'Active' },
    { id: 'users', icon: Users, label: 'Users' },
  ];

  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative left-0 top-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {isAdmin ? 'Admin Portal' : 'Customer Portal'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {user?.companyName || 'Team Elogisol'}
          </div>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            © 2025 Team Elogisol
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;