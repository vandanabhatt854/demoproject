import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-5xl font-bold text-white">404</h1>
      <p className="text-slate-400">The page you are looking for does not exist.</p>
      <Link to="/"><Button>Back Home</Button></Link>
    </div>
  );
}
