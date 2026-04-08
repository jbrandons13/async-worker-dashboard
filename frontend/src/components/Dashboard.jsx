import { JobCard } from './JobCard';
import { AnimatePresence } from 'framer-motion';

export const Dashboard = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <div className="glass h-64 rounded-xl flex flex-col items-center justify-center border-dashed border-white/10 group">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <div className="w-8 h-8 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
        <div className="text-white/40 font-mono text-sm uppercase tracking-widest">
          Awaiting Data Stream...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </AnimatePresence>
    </div>
  );
};
