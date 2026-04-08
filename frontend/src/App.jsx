import React from 'react';
import { useJobStream } from './hooks/useJobStream';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { Dashboard } from './components/Dashboard';

function App() {
  const { jobs, status, addJobs, clearJobs } = useJobStream();

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <Header status={status} onAdd={addJobs} onClear={clearJobs} />
      
      <main>
        <StatsBar jobs={jobs} />
        
        <div className="flex items-center gap-2 mb-6">
          <div className="h-[1px] flex-1 bg-white/10" />
          <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-white/30 whitespace-nowrap">
            Live Queue Monitor
          </h2>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        <Dashboard jobs={jobs} />
      </main>

      <footer className="mt-12 pt-8 border-t border-white/5 text-center">
        <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
          Node-Worker Core Engine v1.0.42 // Decoupled Async Architecture
        </div>
      </footer>
    </div>
  );
}

export default App;
