import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, LogIn } from 'lucide-react';
import { APP_NAME, ROUTES } from '../../constants';
import Button from '../ui/Button';

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to={ROUTES.home} className="text-lg font-semibold text-white">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink className="text-sm text-slate-300 hover:text-white" to={ROUTES.home}>Home</NavLink>
          <NavLink className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white" to={ROUTES.dashboard}>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <Link to={ROUTES.login}>
            <Button variant="outline" className="gap-2">
              <LogIn size={16} />
              Login
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
