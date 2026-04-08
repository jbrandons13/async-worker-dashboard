import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'processing': return <Loader2 size={16} className="animate-spin text-blue-400" />;
    case 'completed': return <CheckCircle2 size={16} className="text-emerald-400" />;
    case 'failed': return <AlertCircle size={16} className="text-red-400" />;
    default: return <Clock size={16} className="text-amber-400" />;
  }
};

export const JobCard = ({ job }) => {
  const isProcessing = job.status === 'processing';
  
  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`glass p-4 rounded-xl border border-white/5 relative overflow-hidden group hover:border-white/20 transition-colors ${isProcessing ? 'shadow-[0_0_15px_rgba(59,130,246,0.1)]' : ''}`}
    >
      {/* Background Glow during processing */}
      {isProcessing && (
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">
            Task ID: {job.id.slice(-6)}
          </div>
          <div className="text-sm font-bold text-white uppercase tracking-tight">
            Node Logic <span className="text-indigo-400">#{job.itemIndex + 1}</span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1.5 ${
          job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
          job.status === 'failed' ? 'bg-red-500/10 text-red-400' :
          job.status === 'processing' ? 'bg-blue-500/10 text-blue-400' :
          'bg-amber-500/10 text-amber-400'
        }`}>
          <StatusIcon status={job.status} />
          {job.status}
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${job.progress}%` }}
            className={`h-full transition-all duration-500 ${
              job.status === 'failed' ? 'bg-red-500' : 
              job.status === 'completed' ? 'bg-emerald-500' : 
              'bg-blue-500'
            }`}
          />
        </div>
        
        <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
          <div className="flex items-center gap-1">
            <Clock size={10} />
            {job.startedAt ? new Date(job.startedAt).toLocaleTimeString() : 'Waiting...'}
          </div>
          <div className="font-bold text-white/60">
            {Math.round(job.progress)}%
          </div>
        </div>

        {job.error && (
          <div className="text-[10px] text-red-400 mt-2 bg-red-500/5 p-2 rounded border border-red-500/10 font-mono">
            ERR: {job.error}
          </div>
        )}
      </div>
    </motion.div>
  );
};
