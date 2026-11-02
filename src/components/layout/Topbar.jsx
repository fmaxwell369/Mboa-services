import { Menu, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header>
      <button onClick={onMenuClick}>
        <Menu />
      </button>

      <div />

      <div>
        <button>
          <Bell />
        </button>

        <div>
          <div>
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <p>{user?.name ?? 'Utilisateur'}</p>
            <p>{user?.email}</p>
          </div>
        </div>

        <button onClick={logout}>
          <LogOut />
        </button>
      </div>
    </header>
  );
}