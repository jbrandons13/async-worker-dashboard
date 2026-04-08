import { parentPort } from 'worker_threads';

const simulateWork = async (job) => {
  const duration = 2000 + Math.random() * 3000; // 2-5 seconds
  const steps = 4;
  
  for (let i = 1; i <= steps; i++) {
    await new Promise(resolve => setTimeout(resolve, duration / steps));
    
    // Simulate ~15% failure rate at the final step
    if (i === steps && Math.random() < 0.15) {
      throw new Error('Random processing failure');
    }

    parentPort.postMessage({
      type: 'progress',
      jobId: job.id,
      progress: (i / steps) * 100
    });
  }
};

parentPort.on('message', async (job) => {
  try {
    parentPort.postMessage({ type: 'started', jobId: job.id });
    await simulateWork(job);
    parentPort.postMessage({ type: 'completed', jobId: job.id });
  } catch (error) {
    parentPort.postMessage({ 
      type: 'failed', 
      jobId: job.id, 
      error: error.message 
    });
  }
});
