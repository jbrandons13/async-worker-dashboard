import { EventEmitter } from 'events';

class TaskQueue extends EventEmitter {
  constructor() {
    super();
    this.jobs = new Map();
  }

  addJobs(batchId, count) {
    const newJobs = [];
    for (let i = 0; i < count; i++) {
      const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const job = {
        id: jobId,
        batchId,
        itemIndex: i,
        status: 'pending',
        progress: 0,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
        error: null
      };
      this.jobs.set(jobId, job);
      newJobs.push(job);
    }
    this.emit('change');
    return newJobs;
  }

  updateJob(jobId, updates) {
    const job = this.jobs.get(jobId);
    if (job) {
      Object.assign(job, updates);
      this.emit('change');
    }
  }

  getNextPending() {
    for (const job of this.jobs.values()) {
      if (job.status === 'pending') return job;
    }
    return null;
  }

  getAllJobs() {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  clearFinished() {
    for (const [id, job] of this.jobs.entries()) {
      if (job.status === 'completed' || job.status === 'failed') {
        this.jobs.delete(id);
      }
    }
    this.emit('change');
  }
}

export const taskQueue = new TaskQueue();
