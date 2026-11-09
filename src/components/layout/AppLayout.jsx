
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout() {
  const [open, setOpen] = useState(false);

  const closeSidebar = () => setOpen(false);

  return (
    <div className="min-h-screen bg-[#142B25] text-white">

      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
            onClick={closeSidebar}
          />

          <div className="relative z-10 h-full w-72">
            <Sidebar onNavigate={closeSidebar} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="min-h-screen md:ml-72">
        <Topbar onMenuClick={() => setOpen(true)} />

        <main className="min-h-[calc(100vh-5rem)] p-4 md:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
