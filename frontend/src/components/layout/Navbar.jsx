import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn, LogOut, UserPlus } from 'lucide-react';
import { APP_NAME, ROUTES } from '../../constants';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  return (
    <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to={ROUTES.home} className="text-lg font-semibold text-white">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink className="text-sm text-slate-300 hover:text-white" to={ROUTES.home}>Home</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white" to={ROUTES.dashboard}>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
              <Button variant="outline" className="gap-2" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to={ROUTES.login}>
                <Button variant="outline" className="gap-2">
                  <LogIn size={16} />
                  Login
                </Button>
              </Link>
              <Link to={ROUTES.register}>
                <Button className="gap-2">
                  <UserPlus size={16} />
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
