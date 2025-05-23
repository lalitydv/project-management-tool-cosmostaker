import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/'); // redirect to login page
  };

  return (
    <header className="w-full bg-white dark:bg-gray-800 px-6 py-4 shadow-sm flex items-center justify-between relative">
      <input
        type="text"
        placeholder="Search Task, Meeting, Projects..."
        className="w-full max-w-md px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700"
      />

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 focus:outline-none"
        >
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {user?.email || 'Guest'}
          </span>
          <img
            src="/avatar.png"
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-md shadow-lg z-20">
            <button
              onClick={() => {
                navigate('/profile'); // navigate to profile page
                setDropdownOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
