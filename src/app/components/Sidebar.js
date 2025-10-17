import { useRouter } from 'next/navigation';
import { User, Home, LogOut, PlusCircle, X } from 'lucide-react';
import React from 'react';

/**
 * Responsive Sidebar Component
 * Controlled component that requires isMenuOpen and onClose props for mobile functionality.
 *
 * @param {Object} props - Component props
 * @param {Object} props.user - User object (must contain name or email)
 * @param {Function} props.onLogout - Function to handle user logout
 * @param {boolean} props.isMenuOpen - State to control if the mobile menu is open
 * @param {Function} props.onClose - Function to close the mobile menu
 */
export default function Sidebar({ user, onLogout, isMenuOpen, onClose }) {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
    // Close menu after navigation on mobile
    if (onClose) {
      onClose();
    }
  };

  // The main sidebar container styling handles desktop (static) and mobile (fixed slide-out)
  const sidebarClasses = `
    w-64 bg-white shadow-2xl flex flex-col p-6 border-r border-gray-200 min-h-screen
    fixed top-0 left-0 z-50 h-full overflow-y-auto transform transition-transform duration-300 ease-in-out
    ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    md:sticky md:top-0 md:flex md:translate-x-0 md:min-h-screen md:shadow-xl md:z-auto
  `;

  return (
    <>
      {/* Mobile Backdrop (Click outside to close) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40 md:hidden transition-colors duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={sidebarClasses}>
        
        {/* Mobile Close Button */}
        <button 
          onClick={onClose} 
          className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-indigo-600 p-1 rounded-full transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-400 flex items-center justify-center mb-2 shadow-lg">
            <User className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">TaskFlow</h1>
          <span className="text-xs text-gray-400 mt-1">Project Dashboard</span>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 mb-8">
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.01]"
            onClick={() => handleNavigation('/dashboard')}
          >
            <Home className="w-5 h-5" />
            Dashboard
          </button>
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-100 text-green-700 font-bold hover:bg-green-200 transition transform hover:scale-[1.01]"
            onClick={() => handleNavigation('/project/create')}
          >
            <PlusCircle className="w-5 h-5" />
            New Project
          </button>
        </nav>
        
        {/* User Info and Logout */}
        <div className="mt-auto pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-2 bg-gray-50 p-3 rounded-lg">
            <User className="w-5 h-5 text-indigo-500" />
            <div className="truncate">
              <span className="font-semibold text-gray-700 text-sm block leading-none">{user?.name || 'Guest'}</span>
              <span className="text-xs text-gray-500 block truncate">{user?.email}</span>
            </div>
          </div>
          
          <button
            className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200 transition w-full shadow-md"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
