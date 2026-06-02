import SectionHeading from '../components/common/SectionHeading';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

export default function Home() {
  return (
    <section className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SectionHeading
          title="Production-ready React frontend starter"
          description="A modular Vite + React foundation with routing, API services, protected routes, Tailwind, and reusable UI primitives."
        />
      </motion.div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Sparkles, title: 'Modular structure', desc: 'Clear separation of concerns across routes, services, UI, and pages.' },
          { icon: ShieldCheck, title: 'Protected routes', desc: 'Ready to guard authenticated screens and expand into real auth flows.' },
          { icon: ArrowRight, title: 'API-ready architecture', desc: 'Axios instance and service layer are ready for backend integration.' }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft"
            >
              <Icon className="mb-4 text-brand-500" size={22} />
              <h2 className="text-lg font-medium text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
      <div>
        <Link to={ROUTES.register}>
          <Button className="gap-2">
            Get Started
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </section>
  );
}
