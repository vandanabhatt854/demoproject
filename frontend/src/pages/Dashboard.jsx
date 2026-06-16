import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getProfile } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        setUser(response.data.user);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load profile';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [setUser]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="space-y-2 text-slate-300">
        <p><span className="text-white">Name:</span> {user?.name}</p>
        <p><span className="text-white">Email:</span> {user?.email}</p>
        <p><span className="text-white">Verified:</span> {user?.isEmailVerified ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
