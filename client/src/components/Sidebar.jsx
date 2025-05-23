import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiFileText,
  FiSettings,
  FiMenu,
  FiFolder,
  FiMail,
  FiActivity,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
    { label: 'Projects', path: '/projects', icon: <FiFileText /> },
    { label: 'Tasks', path: '/tasks', icon: <FiUsers /> },
    { label: 'Reports', path: '/reports', icon: <FiFolder /> },
    { label: 'Messages', path: '/messages', icon: <FiMail /> },
    { label: 'Activity', path: '/activity', icon: <FiActivity /> },
    { label: 'Settings', path: '/settings', icon: <FiSettings /> },
  ];

  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-3 fixed top-2 left-2 z-50 bg-primary text-white rounded shadow"
      >
        <FiMenu size={20} />
      </button>
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: open || window.innerWidth >= 768 ? 0 : -260 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 shadow-lg z-40 md:block hidden"
      >
        <div className="text-3xl font-bold text-primary p-6">.panze</div>
        <nav className="flex flex-col gap-2 px-4">
          {navItems.map((item) => (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary'
                }`
              }
              key={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;
