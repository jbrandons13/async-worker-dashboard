import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { taskQueue } from '../queue/taskQueue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class WorkerManager {
  constructor() {
    this.worker = null;
    this.isProcessing = false;
  }

  start() {
    if (this.worker) return;

    const workerPath = join(__dirname, 'worker.js');
    this.worker = new Worker(workerPath);

    this.worker.on('message', (msg) => {
      const { type, jobId, progress, error } = msg;

      switch (type) {
        case 'started':
          taskQueue.updateJob(jobId, { status: 'processing', startedAt: new Date() });
          break;
        case 'progress':
          taskQueue.updateJob(jobId, { progress });
          break;
        case 'completed':
          taskQueue.updateJob(jobId, { status: 'completed', progress: 100, completedAt: new Date() });
          this.isProcessing = false;
          this.processNext();
          break;
        case 'failed':
          taskQueue.updateJob(jobId, { status: 'failed', error, completedAt: new Date() });
          this.isProcessing = false;
          this.processNext();
          break;
      }
    });

    this.worker.on('error', (err) => {
      console.error('Worker error:', err);
      this.isProcessing = false;
      this.restart();
    });

    this.worker.on('exit', (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
      this.worker = null;
      this.isProcessing = false;
    });

    // Start processing loop
    this.processNext();
  }

  processNext() {
    if (this.isProcessing) return;

    const nextJob = taskQueue.getNextPending();
    if (nextJob) {
      this.isProcessing = true;
      this.worker.postMessage(nextJob);
    }
  }

  restart() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.start();
  }
}

export const workerManager = new WorkerManager();
