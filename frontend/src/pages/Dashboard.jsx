import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function Dashboard() {
  const loading = false;
  const error = '';

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">Welcome to your dashboard.</div>;
}
