import React from 'react';
import { Activity, Play, Trash2, Cpu } from 'lucide-react';

export const Header = ({ status, onAdd, onClear }) => {
  return (
    <header className="glass mb-8 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 glow-primary">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
          <Cpu size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">
            Async Worker <span className="text-indigo-400">Dashboard</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-white/50 uppercase tracking-widest font-mono">
              System Status: {status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => onAdd(10)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-lg text-sm font-bold uppercase tracking-wider group"
        >
          <Play size={18} className="group-hover:scale-110 transition-transform" />
          Start Bulk Process (10)
        </button>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-all rounded-lg text-sm font-bold uppercase tracking-wider text-white/60 hover:text-white"
        >
          <Trash2 size={18} />
          Wipe Logs
        </button>
      </div>
    </header>
  );
};
