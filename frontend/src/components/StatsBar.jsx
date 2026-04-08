import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, colorClass }) => (
  <div className="glass p-4 rounded-xl flex-1 border-l-4" style={{ borderLeftColor: `var(--color-${colorClass})` }}>
    <div className="text-xs uppercase tracking-widest text-white/40 mb-1 font-mono">{label}</div>
    <motion.div 
      key={value}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-2xl font-black text-white"
    >
      {String(value).padStart(2, '0')}
    </motion.div>
  </div>
);

export const StatsBar = ({ jobs }) => {
  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    processing: jobs.filter(j => j.status === 'processing').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <StatCard label="Total Nodes" value={stats.total} colorClass="primary-accent" />
      <StatCard label="Queued" value={stats.pending} colorClass="warning" />
      <StatCard label="Processing" value={stats.processing} colorClass="processing" />
      <StatCard label="Verified" value={stats.completed} colorClass="success" />
      <StatCard label="Errors" value={stats.failed} colorClass="danger" />
    </div>
  );
};
