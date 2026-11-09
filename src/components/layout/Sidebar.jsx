
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Users,
  Settings,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  {
    to: '/dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    roles: ['admin', 'user'],
  },
  {
    to: '/documents',
    label: 'Mes démarches',
    icon: FileText,
    roles: ['admin', 'user'],
  },
  {
    to: '/upload',
    label: 'Nouvelle demande',
    icon: Upload,
    roles: ['user'],
  },
  {
    to: '/users',
    label: 'Utilisateurs',
    icon: Users,
    roles: ['admin'],
  },
  {
    to: '/settings',
    label: 'Paramètres',
    icon: Settings,
    roles: ['admin', 'user'],
  },
];

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-white/10 bg-[#142B25] text-white">

      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#007A3D]">
            <ShieldCheck size={25} className="text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Mboa<span className="text-[#FCD116]">Services</span>
            </h1>
            <p className="text-xs text-slate-400">
              Portail citoyen du Cameroun
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <span className="h-1.5 flex-1 rounded-full bg-[#007A3D]" />
          <span className="h-1.5 flex-1 rounded-full bg-[#CE1126]" />
          <span className="h-1.5 flex-1 rounded-full bg-[#FCD116]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Menu principal
        </p>

        {links
          .filter((link) => link.roles.includes(user?.role))
          .map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? 'bg-[#007A3D] text-white shadow-lg shadow-black/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>

                  {isActive && (
                    <ChevronRight size={17} className="text-[#FCD116]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
      </nav>

      {/* User information */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-[#243C33] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007A3D] font-bold">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name ?? 'Utilisateur'}
              </p>
              <p className="text-xs text-slate-400">
                {user?.role === 'admin'
                  ? 'Administrateur'
                  : 'Espace citoyen'}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Application en ligne
          </div>
        </div>
      </div>
    </aside>
  );
}
