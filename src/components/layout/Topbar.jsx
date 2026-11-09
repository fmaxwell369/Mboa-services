
import { Menu, LogOut, Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#142B25]/95 px-4 backdrop-blur-xl md:px-8">

      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          className="rounded-xl bg-white/5 p-2 text-white transition hover:bg-white/10 md:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-bold text-white md:text-xl">
            Espace citoyen
          </h2>
          <p className="hidden text-xs text-slate-400 sm:block">
            Vos démarches administratives en toute simplicité
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 md:gap-5">

        {/* Search */}
        <button
          aria-label="Rechercher"
          className="hidden rounded-xl bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white sm:block"
        >
          <Search size={19} />
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative rounded-xl bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#142B25] bg-[#CE1126]" />
        </button>

        {/* Cameroon accent */}
        <div className="hidden h-9 w-px bg-white/10 sm:block" />

        {/* Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#FCD116] bg-[#007A3D] font-bold text-white">
            {initial}
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="max-w-32 truncate text-sm font-semibold text-white">
              {user?.name ?? 'Utilisateur'}
            </p>
            <p className="max-w-32 truncate text-xs text-slate-400">
              {user?.role === 'admin' ? 'Administrateur' : 'Citoyen'}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          aria-label="Se déconnecter"
          title="Se déconnecter"
          className="rounded-xl bg-white/5 p-3 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}
