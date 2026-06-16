import AppRoutes from './routes';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { tokenStorage } from './utils/tokenStorage';

export default function App() {
  const { login, logout } = useAuth();

  useEffect(() => {
    const token = tokenStorage.getToken();
    const user = tokenStorage.getUser();
    if (token && user) {
      login(token, user);
    } else {
      logout();
    }
  }, []);

  return <AppRoutes />;
}
