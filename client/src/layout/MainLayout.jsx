// File: /src/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex bg-lightBg dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        <Topbar />
        <main className="p-4">
          <Outlet /> {/* This will render nested route components */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
