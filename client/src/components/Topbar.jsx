// src/components/Topbar.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // 🌗 Handle theme toggling
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // 🧭 Breadcrumb generation
  const crumbs = location.pathname.split('/').filter(Boolean);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-full">
      {/* 🔝 Top Bar */}
      <header className="bg-white dark:bg-gray-800 px-6 py-4 shadow-sm flex items-center justify-between relative">
        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search Task, Meeting, Projects..."
          className="w-full max-w-md px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
        />

        {/* 🌗 Theme + Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl text-gray-600 dark:text-white"
            title="Toggle Theme"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>

          {/* 👤 User Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 focus:outline-none"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300 capitalize">
                  {user?.role || 'Role'}
                </p>
              </div>
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 rounded-md shadow-lg z-20">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Profile
                </button>

                {/* 🔐 Role-based links */}
                {user?.role === 'Admin' && (
                  <button
                    onClick={() => {
                      navigate('/admin-panel');
                      setDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Admin Panel
                  </button>
                )}
                {user?.role === 'Member' && (
                  <button
                    onClick={() => {
                      navigate('/my-tasks');
                      setDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    My Tasks
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🧭 Breadcrumbs */}
      <nav className="px-6 py-2 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-sm">
        <span className="text-gray-600 dark:text-gray-200">Dashboard</span>
        {crumbs.map((crumb, index) => (
          <span key={index}>
            {' '}
            /{' '}
            <span className="capitalize text-primary font-medium">
              {decodeURIComponent(crumb)}
            </span>
          </span>
        ))}
      </nav>
    </div>
  );
};

export default Topbar;
