import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Users,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['admin', 'user'] },
  { to: '/documents', label: 'Documents', icon: FileText, roles: ['admin', 'user'] },
  { to: '/upload', label: 'Nouveau document', icon: Upload, roles: ['user'] },
  { to: '/users', label: 'Utilisateurs', icon: Users, roles: ['admin'] },
  { to: '/settings', label: 'Paramètres', icon: Settings, roles: ['admin', 'user'] },
];

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth();

  return (
    <aside>
      <div>
        
        <span>CertifDoc</span>
      </div>

      <nav>
        {links
          .filter((l) => l.roles.includes(user?.role))
          .map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
            >
              <span>{label}</span>
            </NavLink>
          ))}
      </nav>

      <div>
        <ShieldCheck />
        <p>Espace {user?.role === 'admin' ? 'administrateur' : 'utilisateur'}</p>
      </div>
    </aside>
  );
}